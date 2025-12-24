'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

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

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
type TabType = 'basic' | 'combinations' | 'games';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Probability Calculator?",
    answer: "A Probability Calculator is a free online tool designed to help you quickly and accurately calculate probability-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Probability Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Probability Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Probability Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ProbabilityCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('probability-calculator');

  const [activeTab, setActiveTab] = useState<TabType>('basic');

  // Basic Probability State
  const [favorableOutcomes, setFavorableOutcomes] = useState(1);
  const [totalOutcomes, setTotalOutcomes] = useState(6);

  // Combinations State
  const [n, setN] = useState(10);
  const [r, setR] = useState(3);
  const [calcType, setCalcType] = useState<'combination' | 'permutation'>('combination');

  // Dice State
  const [diceSides, setDiceSides] = useState(6);
  const [numDice, setNumDice] = useState(2);
  const [targetSum, setTargetSum] = useState(7);

  const relatedCalculators = [
    { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages' },
    { href: '/us/tools/calculators/fraction-calculator', title: 'Fraction Calculator', description: 'Work with fractions' },
    { href: '/us/tools/calculators/average-calculator', title: 'Average Calculator', description: 'Statistical averages' },
    { href: '/us/tools/calculators/ratio-calculator', title: 'Ratio Calculator', description: 'Calculate ratios' },
  ];

  // Helper functions
  const countWaysToSum = (dice: number, sides: number, target: number): number => {
    const dp: number[][] = Array(dice + 1).fill(null).map(() => Array(target + 1).fill(0));
    dp[0][0] = 1;

    for (let d = 1; d <= dice; d++) {
      for (let s = d; s <= Math.min(target, d * sides); s++) {
        for (let face = 1; face <= sides && face <= s; face++) {
          dp[d][s] += dp[d-1][s-face];
        }
      }
    }

    return dp[dice][target];
  };

  const combination = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    if (r === 0 || r === n) return 1;

    r = Math.min(r, n - r);
    let result = 1;
    for (let i = 0; i < r; i++) {
      result = result * (n - i) / (i + 1);
    }
    return Math.round(result);
  };

  const permutation = (n: number, r: number): number => {
    if (r > n || r < 0) return 0;
    let result = 1;
    for (let i = 0; i < r; i++) {
      result *= (n - i);
    }
    return result;
  };

  // Calculations
  const basicProbability = favorableOutcomes / totalOutcomes;
  const basicPercentage = basicProbability * 100;
  const basicOdds = favorableOutcomes > 0 ? `${favorableOutcomes}:${totalOutcomes - favorableOutcomes}` : '0:1';

  const combinationResult = calcType === 'combination' ? combination(n, r) : permutation(n, r);

  const minSum = numDice;
  const maxSum = numDice * diceSides;
  const totalDiceOutcomes = Math.pow(diceSides, numDice);
  const validTarget = targetSum >= minSum && targetSum <= maxSum;
  const favorableDiceOutcomes = validTarget ? countWaysToSum(numDice, diceSides, targetSum) : 0;
  const diceProbability = validTarget ? favorableDiceOutcomes / totalDiceOutcomes : 0;

  const getInterpretation = (percentage: number): { text: string; color: string } => {
    if (percentage === 0) return { text: 'Impossible', color: 'text-red-600' };
    if (percentage < 10) return { text: 'Very Unlikely', color: 'text-orange-600' };
    if (percentage < 25) return { text: 'Unlikely', color: 'text-orange-500' };
    if (percentage < 50) return { text: 'Less Likely', color: 'text-yellow-600' };
    if (percentage === 50) return { text: 'Even Chance', color: 'text-blue-600' };
    if (percentage < 75) return { text: 'More Likely', color: 'text-green-500' };
    if (percentage < 90) return { text: 'Likely', color: 'text-green-600' };
    if (percentage < 100) return { text: 'Very Likely', color: 'text-green-700' };
    return { text: 'Certain', color: 'text-green-800' };
  };

  const interpretation = getInterpretation(basicPercentage);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 py-4 sm:py-6 md:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Probability Calculator')}</h1>
          <p className="text-gray-600">Calculate probability for events, combinations, and dice rolls</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-3 sm:mb-4 md:mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              {[
                { id: 'basic' as TabType, label: 'Basic Probability' },
                { id: 'combinations' as TabType, label: 'Combinations' },
                { id: 'games' as TabType, label: 'Dice & Games' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 py-3 px-4 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-3 sm:p-4 md:p-6">
            {/* Basic Probability Tab */}
            {activeTab === 'basic' && (
              <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Basic Probability</h2>
                  <p className="text-sm text-gray-600 mb-4">P(E) = Favorable Outcomes / Total Outcomes</p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Favorable Outcomes
                      </label>
                      <input
                        type="number"
                        value={favorableOutcomes}
                        onChange={(e) => setFavorableOutcomes(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Total Outcomes
                      </label>
                      <input
                        type="number"
                        value={totalOutcomes}
                        onChange={(e) => setTotalOutcomes(Math.max(1, parseInt(e.target.value) || 1))}
                        min="1"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Quick Examples */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Quick examples:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { f: 1, t: 6, label: 'Die roll (1)' },
                        { f: 1, t: 2, label: 'Coin flip' },
                        { f: 4, t: 52, label: 'Draw ace' },
                        { f: 13, t: 52, label: 'Draw heart' },
                      ].map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => { setFavorableOutcomes(ex.f); setTotalOutcomes(ex.t); }}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

                  {favorableOutcomes > totalOutcomes ? (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-red-700 text-sm">Favorable outcomes cannot exceed total outcomes</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 mb-4">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-1">{basicPercentage.toFixed(2)}%</div>
                          <div className="text-sm text-blue-600">{basicProbability.toFixed(4)} probability</div>
                          <div className={`text-sm font-medium mt-2 ${interpretation.color}`}>
                            {interpretation.text}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Fraction:</span>
                            <span className="font-medium">{favorableOutcomes}/{totalOutcomes}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Odds:</span>
                            <span className="font-medium">{basicOdds}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Complement:</span>
                            <span className="font-medium">{((1 - basicProbability) * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Combinations Tab */}
            {activeTab === 'combinations' && (
              <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Combinations & Permutations</h2>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Total Items (n)</label>
                      <input
                        type="number"
                        value={n}
                        onChange={(e) => setN(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Items to Choose (r)</label>
                      <input
                        type="number"
                        value={r}
                        onChange={(e) => setR(Math.max(0, parseInt(e.target.value) || 0))}
                        min="0"
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setCalcType('combination')}
                          className={`p-3 rounded-lg border transition-all text-center ${
                            calcType === 'combination'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="font-medium text-sm">Combination</div>
                          <div className="text-xs mt-0.5 opacity-70">Order doesn't matter</div>
                        </button>
                        <button
                          onClick={() => setCalcType('permutation')}
                          className={`p-3 rounded-lg border transition-all text-center ${
                            calcType === 'permutation'
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-200 hover:border-gray-300 text-gray-600'
                          }`}
                        >
                          <div className="font-medium text-sm">Permutation</div>
                          <div className="text-xs mt-0.5 opacity-70">Order matters</div>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

                  {r > n ? (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-red-700 text-sm">r cannot be greater than n</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100 mb-4">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-700">{combinationResult.toLocaleString()}</div>
                          <div className="text-sm text-green-600 mt-1">
                            {calcType === 'combination' ? 'combinations' : 'permutations'}
                          </div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Formula</h3>
                        <div className="font-mono text-sm text-gray-600 bg-white p-3 rounded border">
                          {calcType === 'combination'
                            ? `C(${n},${r}) = ${n}! / (${r}! × ${n-r}!) = ${combinationResult.toLocaleString()}`
                            : `P(${n},${r}) = ${n}! / (${n-r})! = ${combinationResult.toLocaleString()}`
                          }
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {calcType === 'combination'
                            ? `There are ${combinationResult.toLocaleString()} ways to choose ${r} items from ${n} items when order doesn't matter.`
                            : `There are ${combinationResult.toLocaleString()} ways to arrange ${r} items from ${n} items when order matters.`
                          }
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {/* Games Tab */}
            {activeTab === 'games' && (
              <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Dice Probability</h2>

                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dice Sides</label>
                        <input
                          type="number"
                          value={diceSides}
                          onChange={(e) => setDiceSides(Math.max(2, parseInt(e.target.value) || 6))}
                          min="2"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Number of Dice</label>
                        <input
                          type="number"
                          value={numDice}
                          onChange={(e) => setNumDice(Math.max(1, parseInt(e.target.value) || 1))}
                          min="1"
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Target Sum ({minSum} to {maxSum})
                      </label>
                      <input
                        type="number"
                        value={targetSum}
                        onChange={(e) => setTargetSum(parseInt(e.target.value) || minSum)}
                        min={minSum}
                        max={maxSum}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>

                  {/* Quick Presets */}
                  <div className="mt-4">
                    <p className="text-sm text-gray-600 mb-2">Presets:</p>
                    <div className="flex flex-wrap gap-2">
                      {[
                        { d: 6, n: 1, t: 1, label: 'Single die' },
                        { d: 6, n: 2, t: 7, label: '2d6 sum 7' },
                        { d: 20, n: 1, t: 20, label: 'd20 nat 20' },
                      ].map((ex, i) => (
                        <button
                          key={i}
                          onClick={() => { setDiceSides(ex.d); setNumDice(ex.n); setTargetSum(ex.t); }}
                          className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                        >
                          {ex.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800 mb-4">Result</h2>

                  {!validTarget ? (
                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <p className="text-red-700 text-sm">Target sum must be between {minSum} and {maxSum}</p>
                    </div>
                  ) : (
                    <>
                      <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg p-5 border border-purple-100 mb-4">
                        <div className="text-center">
                          <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-700">{(diceProbability * 100).toFixed(2)}%</div>
                          <div className="text-sm text-purple-600 mt-1">P(sum = {targetSum})</div>
                        </div>
                      </div>

                      <div className="bg-gray-50 rounded-lg p-4">
                        <h3 className="text-sm font-medium text-gray-700 mb-3">Details</h3>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-500">Configuration:</span>
                            <span className="font-medium">{numDice}d{diceSides}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Favorable outcomes:</span>
                            <span className="font-medium">{favorableDiceOutcomes.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Total outcomes:</span>
                            <span className="font-medium">{totalDiceOutcomes.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-500">Probability:</span>
                            <span className="font-medium">{favorableDiceOutcomes}/{totalDiceOutcomes}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Formulas Reference */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Key Formulas</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-medium text-blue-900 mb-2">Basic Probability</h3>
              <div className="font-mono text-xs text-blue-800 bg-white p-2 rounded">
                P(E) = n(E) / n(S)
              </div>
              <p className="text-xs text-blue-700 mt-2">Favorable / Total outcomes</p>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-medium text-green-900 mb-2">Combinations</h3>
              <div className="font-mono text-xs text-green-800 bg-white p-2 rounded">
                C(n,r) = n! / (r!(n-r)!)
              </div>
              <p className="text-xs text-green-700 mt-2">Order doesn't matter</p>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-medium text-purple-900 mb-2">Permutations</h3>
              <div className="font-mono text-xs text-purple-800 bg-white p-2 rounded">
                P(n,r) = n! / (n-r)!
              </div>
              <p className="text-xs text-purple-700 mt-2">Order matters</p>
            </div>
          </div>
        </div>
{/* Probability Rules */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Probability Rules</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Addition Rule (OR)</h3>
              <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                P(A or B) = P(A) + P(B) - P(A and B)
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Multiplication Rule (AND)</h3>
              <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                P(A and B) = P(A) × P(B|A)
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Complement Rule</h3>
              <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                P(not A) = 1 - P(A)
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Independent Events</h3>
              <div className="text-sm text-gray-600 font-mono bg-gray-50 p-2 rounded">
                P(A and B) = P(A) × P(B)
              </div>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Related Calculators</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {relatedCalculators.map((calc) => (
              <Link
                key={calc.href}
                href={calc.href}
                className="p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all group"
              >
                <div className="font-medium text-gray-900 text-sm group-hover:text-blue-700">{calc.title}</div>
                <div className="text-xs text-gray-500 mt-0.5">{calc.description}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="probability-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
