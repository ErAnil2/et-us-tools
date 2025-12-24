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
    question: "What is a Winning Percentage Calculator?",
    answer: "A Winning Percentage Calculator is a mathematical tool that helps you quickly calculate or convert winning percentage-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Winning Percentage Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Winning Percentage Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Winning Percentage Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function WinningPercentageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('winning-percentage-calculator');

  const [wins, setWins] = useState('10');
  const [losses, setLosses] = useState('5');
  const [ties, setTies] = useState('1');
  const [tieMethod, setTieMethod] = useState('half');
  const [resultsHTML, setResultsHTML] = useState('');

  useEffect(() => {
    calculateWinningPercentage();
  }, [wins, losses, ties, tieMethod]);

  const calculateWinningPercentage = () => {
    const winsCount = parseInt(wins) || 0;
    const lossesCount = parseInt(losses) || 0;
    const tiesCount = parseInt(ties) || 0;

    const totalGames = winsCount + lossesCount + tiesCount;

    if (totalGames === 0) {
      setResultsHTML('<div class="text-center text-gray-500">Enter game results to see statistics</div>');
      return;
    }

    let effectiveWins: number;
    let effectiveTotal: number;
    let winningPercentage: number;
    let formula: string;
    let description: string;

    switch (tieMethod) {
      case 'half':
        effectiveWins = winsCount + (tiesCount * 0.5);
        effectiveTotal = totalGames;
        winningPercentage = (effectiveWins / effectiveTotal) * 100;
        formula = `(${winsCount} + 0.5 × ${tiesCount}) / ${totalGames} × 100%`;
        description = 'Ties counted as 0.5 wins';
        break;
      case 'exclude':
        effectiveWins = winsCount;
        effectiveTotal = winsCount + lossesCount;
        if (effectiveTotal === 0) {
          setResultsHTML('<div class="text-center text-yellow-500">No decisive games (wins/losses) to calculate percentage</div>');
          return;
        }
        winningPercentage = (effectiveWins / effectiveTotal) * 100;
        formula = `${winsCount} / (${winsCount} + ${lossesCount}) × 100%`;
        description = 'Ties excluded from calculation';
        break;
      case 'loss':
        effectiveWins = winsCount;
        effectiveTotal = totalGames;
        winningPercentage = (effectiveWins / effectiveTotal) * 100;
        formula = `${winsCount} / ${totalGames} × 100%`;
        description = 'Ties counted as losses';
        break;
      default:
        return;
    }

    // Determine performance rating
    let rating: string;
    let ratingColor: string;
    let ratingBg: string;
    if (winningPercentage >= 71) {
      rating = 'Excellent';
      ratingColor = 'text-blue-600';
      ratingBg = 'bg-blue-50 border-blue-200';
    } else if (winningPercentage >= 55) {
      rating = 'Good';
      ratingColor = 'text-green-600';
      ratingBg = 'bg-green-50 border-green-200';
    } else if (winningPercentage >= 46) {
      rating = 'Average';
      ratingColor = 'text-yellow-600';
      ratingBg = 'bg-yellow-50 border-yellow-200';
    } else if (winningPercentage >= 31) {
      rating = 'Below Average';
      ratingColor = 'text-orange-600';
      ratingBg = 'bg-orange-50 border-orange-200';
    } else {
      rating = 'Poor';
      ratingColor = 'text-red-600';
      ratingBg = 'bg-red-50 border-red-200';
    }

    // Calculate additional stats
    const losingPercentage = 100 - winningPercentage;
    const winLossRatio = lossesCount > 0 ? (winsCount / lossesCount).toFixed(2) : '∞';
    const gamesNeededFor500 = calculateGamesNeededFor500(winsCount, lossesCount, tiesCount, tieMethod);

    const borderColor = ratingBg.includes('blue') ? 'border-blue-200' :
                       ratingBg.includes('green') ? 'border-green-200' :
                       ratingBg.includes('yellow') ? 'border-yellow-200' :
                       ratingBg.includes('orange') ? 'border-orange-200' : 'border-red-200';

    const html = `
      <div class="space-y-4">
        <!-- Main Result -->
        <div class="bg-white border-2 ${borderColor} rounded-lg p-4">
          <div class="text-center">
            <div class="text-4xl font-bold ${ratingColor} mb-2">
              ${winningPercentage.toFixed(1)}%
            </div>
            <div class="text-lg font-semibold ${ratingColor} mb-1">${rating} Performance</div>
            <div class="text-sm text-gray-600">${description}</div>
          </div>
        </div>

        <!-- Game Summary -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-3">Game Summary</h4>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div class="text-gray-600">Total Games:</div>
              <div class="font-semibold">${totalGames}</div>
            </div>
            <div>
              <div class="text-gray-600">Record:</div>
              <div class="font-semibold">${winsCount}-${lossesCount}${tiesCount > 0 ? `-${tiesCount}` : ''}</div>
            </div>
            <div>
              <div class="text-gray-600">Win-Loss Ratio:</div>
              <div class="font-semibold">${winLossRatio}</div>
            </div>
            <div>
              <div class="text-gray-600">Losing %:</div>
              <div class="font-semibold">${losingPercentage.toFixed(1)}%</div>
            </div>
          </div>
        </div>

        <!-- Calculation Details -->
        <div class="bg-white border rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-2">Calculation</h4>
          <div class="bg-gray-50 p-3 rounded text-sm font-mono mb-2">
            ${formula} = ${winningPercentage.toFixed(1)}%
          </div>
          ${gamesNeededFor500 ? `
            <div class="text-sm text-gray-600">
              <strong>To reach .500:</strong> ${gamesNeededFor500}
            </div>
          ` : ''}
        </div>

        <!-- Performance Analysis -->
        <div class="bg-gradient-to-r ${ratingBg} rounded-lg p-4 border">
          <h4 class="font-semibold text-gray-900 mb-2">Performance Analysis</h4>
          <div class="text-sm text-gray-700">
            ${getPerformanceAnalysis(winningPercentage, winsCount, lossesCount, tiesCount, totalGames)}
          </div>
        </div>
      </div>
    `;

    setResultsHTML(html);
  };

  const calculateGamesNeededFor500 = (winsCount: number, lossesCount: number, tiesCount: number, method: string): string | null => {
    let currentEffectiveWins: number;
    let currentTotal: number;

    switch (method) {
      case 'half':
        currentEffectiveWins = winsCount + (tiesCount * 0.5);
        currentTotal = winsCount + lossesCount + tiesCount;
        break;
      case 'exclude':
        currentEffectiveWins = winsCount;
        currentTotal = winsCount + lossesCount;
        break;
      case 'loss':
        currentEffectiveWins = winsCount;
        currentTotal = winsCount + lossesCount + tiesCount;
        break;
      default:
        return null;
    }

    if (currentEffectiveWins / currentTotal >= 0.5) {
      return null; // Already at or above .500
    }

    // Calculate wins needed to reach .500
    let winsNeeded = 0;
    let tempWins = currentEffectiveWins;
    let tempTotal = currentTotal;

    while (tempWins / tempTotal < 0.5) {
      winsNeeded++;
      tempWins++;
      tempTotal++;
    }

    return `Need ${winsNeeded} more wins`;
  };

  const getPerformanceAnalysis = (percentage: number, winsCount: number, lossesCount: number, tiesCount: number, total: number): string => {
    if (percentage === 100) {
      return `Perfect record! ${winsCount} wins with no losses${tiesCount > 0 ? ` and ${tiesCount} ties` : ''}. This is exceptional performance.`;
    } else if (percentage >= 80) {
      return `Outstanding performance! You're winning ${percentage.toFixed(1)}% of games, which puts you in elite territory.`;
    } else if (percentage >= 70) {
      return `Excellent performance! A ${percentage.toFixed(1)}% winning rate is very strong and indicates consistent success.`;
    } else if (percentage >= 60) {
      return `Good performance! You're winning more often than not with a ${percentage.toFixed(1)}% success rate.`;
    } else if (percentage >= 50) {
      return `Above average performance. You're winning ${percentage.toFixed(1)}% of games, which is better than break-even.`;
    } else if (percentage >= 40) {
      return `Below average performance. At ${percentage.toFixed(1)}%, there's room for improvement to reach a competitive level.`;
    } else if (percentage >= 25) {
      return `Struggling performance. A ${percentage.toFixed(1)}% winning rate suggests significant challenges that need addressing.`;
    } else {
      return `Poor performance. At ${percentage.toFixed(1)}%, this indicates serious issues that require immediate attention and improvement.`;
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Winning Percentage Calculator')}</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Calculate winning percentage for sports teams, games, and competitions. Track wins, losses, and ties to determine success rate.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Section */}
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enter Game Results</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="wins" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Wins
                </label>
                <input
                  type="number"
                  id="wins"
                  value={wins}
                  onChange={(e) => setWins(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter wins"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="losses" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Losses
                </label>
                <input
                  type="number"
                  id="losses"
                  value={losses}
                  onChange={(e) => setLosses(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter losses"
                  min="0"
                />
              </div>

              <div>
                <label htmlFor="ties" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Ties/Draws (Optional)
                </label>
                <input
                  type="number"
                  id="ties"
                  value={ties}
                  onChange={(e) => setTies(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter ties"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tie Handling Method
                </label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tieMethod"
                      value="half"
                      checked={tieMethod === 'half'}
                      onChange={(e) => setTieMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Count ties as 0.5 wins (Standard)</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tieMethod"
                      value="exclude"
                      checked={tieMethod === 'exclude'}
                      onChange={(e) => setTieMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Exclude ties from calculation</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="tieMethod"
                      value="loss"
                      checked={tieMethod === 'loss'}
                      onChange={(e) => setTieMethod(e.target.value)}
                      className="mr-2"
                    />
                    <span className="text-sm">Count ties as losses</span>
                  </label>
                </div>
              </div>

              <button
                onClick={calculateWinningPercentage}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                Calculate Winning Percentage
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Results</h2>
            <div dangerouslySetInnerHTML={{ __html: resultsHTML || '<div class="text-center text-gray-500">Enter game results to see statistics</div>' }} />
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        {/* How It Works */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How It Works</h2>
          <div className="space-y-4 text-gray-700">
            <div>
              <h3 className="font-semibold text-lg">Standard Formula (Ties as 0.5)</h3>
              <div className="bg-white p-3 rounded border font-mono text-sm mb-2">
                (Wins + 0.5 × Ties) / Total Games × 100%
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg">Exclude Ties Method</h3>
              <div className="bg-white p-3 rounded border font-mono text-sm mb-2">
                Wins / (Wins + Losses) × 100%
              </div>
</div>

            <div>
              <h3 className="font-semibold text-lg">Ties as Losses Method</h3>
              <div className="bg-white p-3 rounded border font-mono text-sm">
                Wins / (Wins + Losses + Ties) × 100%
              </div>
            </div>
          </div>
        </div>

        {/* Examples */}
        <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Examples</h2>
          <div className="space-y-4 text-gray-700">
            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Perfect Season</h4>
              <p className="text-sm">16 Wins, 0 Losses, 0 Ties</p>
              <p className="text-sm text-green-600">Winning Percentage: 100%</p>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Balanced Record</h4>
              <p className="text-sm">8 Wins, 6 Losses, 2 Ties</p>
              <p className="text-sm text-blue-600">Winning Percentage: 56.25% (ties as 0.5)</p>
            </div>

            <div className="bg-white p-3 rounded border">
              <h4 className="font-semibold">Struggling Team</h4>
              <p className="text-sm">3 Wins, 13 Losses, 0 Ties</p>
              <p className="text-sm text-red-600">Winning Percentage: 18.75%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Ratings */}
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Performance Ratings</h2>
        <div className="grid md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-red-50 rounded-lg">
            <div className="text-red-600 font-bold text-lg">Poor</div>
            <div className="text-sm text-gray-600">0-30%</div>
            <div className="text-xs text-gray-500 mt-1">Needs improvement</div>
          </div>
          <div className="text-center p-4 bg-orange-50 rounded-lg">
            <div className="text-orange-600 font-bold text-lg">Below Average</div>
            <div className="text-sm text-gray-600">31-45%</div>
            <div className="text-xs text-gray-500 mt-1">Room for growth</div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-yellow-600 font-bold text-lg">Average</div>
            <div className="text-sm text-gray-600">46-54%</div>
            <div className="text-xs text-gray-500 mt-1">Competitive level</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-green-600 font-bold text-lg">Good</div>
            <div className="text-sm text-gray-600">55-70%</div>
            <div className="text-xs text-gray-500 mt-1">Above average</div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-blue-600 font-bold text-lg">Excellent</div>
            <div className="text-sm text-gray-600">71%+</div>
            <div className="text-xs text-gray-500 mt-1">Elite performance</div>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white rounded-lg shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Sports Teams</h3>
            <p className="text-sm text-gray-600">Track season performance, playoff positioning, historical records</p>
          </div>

          <div className="text-center">
            <div className="bg-green-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Gaming & Esports</h3>
            <p className="text-sm text-gray-600">Competitive gaming records, tournament performance, skill tracking</p>
          </div>

          <div className="text-center">
            <div className="bg-purple-100 rounded-full p-3 w-16 h-16 mx-auto mb-3 flex items-center justify-center">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Business Metrics</h3>
            <p className="text-sm text-gray-600">Sales success rates, project completion, performance evaluation</p>
          </div>
        </div>
      </div>

      {/* Tips */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">📊 Tips & Best Practices</h2>
        <div className="grid md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h3 className="font-semibold mb-2">Understanding the Numbers:</h3>
            <ul className="space-y-1 text-sm">
              <li>• 50% = Break-even point (equal wins and losses)</li>
              <li>• Higher percentages indicate better performance</li>
              <li>• Consider sample size - small samples can be misleading</li>
              <li>• Track trends over time, not just single periods</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Tie Handling Guidelines:</h3>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Standard (0.5):</strong> Most common in professional sports</li>
              <li>• <strong>Exclude ties:</strong> Focus purely on decisive outcomes</li>
              <li>• <strong>Ties as losses:</strong> Conservative approach for analysis</li>
              <li>• Choose method based on your specific context</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="winning-percentage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      </div>
    </div>
  );
}
