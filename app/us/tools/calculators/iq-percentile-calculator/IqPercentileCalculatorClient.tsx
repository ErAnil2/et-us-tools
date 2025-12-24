'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface Classification {
  range: string;
  classification: string;
  percentile: string;
  population: string;
}

interface ScoreItem {
  iq: number;
  percentile: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Iq Percentile Calculator?",
    answer: "A Iq Percentile Calculator is a free online tool designed to help you quickly and accurately calculate iq percentile-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Iq Percentile Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Iq Percentile Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Iq Percentile Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function IqPercentileCalculatorClient() {
  // Input state
  const [iqScore, setIqScore] = useState<number>(100);
  const [testType, setTestType] = useState<string>('standard');

  // Results state
  const [percentileRank, setPercentileRank] = useState<string>('50th');
  const [peopleBelow, setPeopleBelow] = useState<string>('50.0%');
  const [peopleAbove, setPeopleAbove] = useState<string>('50.0%');
  const [rarity, setRarity] = useState<string>('1 in 2');
  const [description, setDescription] = useState<string>('Average intelligence');
  const [markerPosition, setMarkerPosition] = useState<number>(50);

  // Standard normal distribution CDF approximation
  const normalCDF = (x: number): number => {
    // Using Abramowitz and Stegun approximation
    const a1 = 0.254829592;
    const a2 = -0.284496736;
    const a3 = 1.421413741;
    const a4 = -1.453152027;
    const a5 = 1.061405429;
    const p = 0.3275911;

    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x) / Math.sqrt(2.0);

    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

    return 0.5 * (1.0 + sign * y);
  };

  // Get IQ description
  const getIQDescription = (iq: number): string => {
    if (iq >= 145) return "Highly gifted - exceptionally rare intelligence";
    if (iq >= 130) return "Gifted - superior intelligence";
    if (iq >= 115) return "Above average intelligence";
    if (iq >= 85) return "Average intelligence";
    if (iq >= 70) return "Below average intelligence";
    return "Significantly below average";
  };

  // Update IQ marker position
  const updateIQMarker = (iq: number): void => {
    // Position marker on the scale (70-145 range)
    const minIQ = 70;
    const maxIQ = 145;
    const position = Math.min(Math.max((iq - minIQ) / (maxIQ - minIQ) * 100, 0), 100);
    setMarkerPosition(position);
  };

  // Calculate IQ percentile
  const calculateIQPercentile = () => {
    // Standardize the IQ score (mean=100, sd=15)
    const standardScore = (iqScore - 100) / 15;

    // Calculate percentile using normal distribution
    const percentile = normalCDF(standardScore) * 100;

    // Update results
    const rank = Math.round(percentile);
    const below = percentile.toFixed(1);
    const above = (100 - percentile).toFixed(1);
    const rarityValue = Math.round(100 / percentile);

    setPercentileRank(`${rank}th`);
    setPeopleBelow(`${below}%`);
    setPeopleAbove(`${above}%`);
    setRarity(`1 in ${rarityValue}`);
    setDescription(getIQDescription(iqScore));
    updateIQMarker(iqScore);
  };

  // Auto-calculate when IQ score changes
  useEffect(() => {
    calculateIQPercentile();
  }, [iqScore]);

  // Classification data
  const classifications: Classification[] = [
    { range: "145+", classification: "Highly Gifted", percentile: "99.9+", population: "0.1%" },
    { range: "130-144", classification: "Gifted", percentile: "98-99.8", population: "2.1%" },
    { range: "115-129", classification: "Above Average", percentile: "84-97", population: "13.6%" },
    { range: "85-114", classification: "Average", percentile: "16-83", population: "68.2%" },
    { range: "70-84", classification: "Below Average", percentile: "2-15", population: "13.6%" },
    { range: "55-69", classification: "Borderline", percentile: "0.1-1", population: "2.3%" },
    { range: "Below 55", classification: "Extremely Low", percentile: "<0.1", population: "0.2%" }
  ];

  // Common scores data
  const commonScores: ScoreItem[] = [
    { iq: 85, percentile: 16 },
    { iq: 90, percentile: 25 },
    { iq: 95, percentile: 37 },
    { iq: 100, percentile: 50 },
    { iq: 105, percentile: 63 },
    { iq: 110, percentile: 75 },
    { iq: 115, percentile: 84 }
  ];

  // High scores data
  const highScores: ScoreItem[] = [
    { iq: 120, percentile: 91 },
    { iq: 125, percentile: 95 },
    { iq: 130, percentile: 98 },
    { iq: 135, percentile: 99 },
    { iq: 140, percentile: 99.6 },
    { iq: 145, percentile: 99.9 },
    { iq: 150, percentile: 99.96 }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <a href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</a>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">IQ Percentile Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">
          IQ Percentile Calculator
        </h1>
        <p className="text-sm md:text-base text-gray-600">
          Discover what percentile your IQ score falls into and how it compares to the general population
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Calculate Your IQ Percentile</h2>

            <div className="mb-4 sm:mb-6 md:mb-8">
              <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
                <div>
                  <label htmlFor="iqScore" className="block text-sm font-medium text-gray-700 mb-2">Your IQ Score</label>
                  <input
                    type="number"
                    id="iqScore"
                    value={iqScore}
                    onChange={(e) => setIqScore(parseInt(e.target.value) || 100)}
                    min="40"
                    max="200"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">Enter your IQ test score (typically 40-200)</div>
                </div>
                <div>
                  <label htmlFor="testType" className="block text-sm font-medium text-gray-700 mb-2">Test Type (Optional)</label>
                  <select
                    id="testType"
                    value={testType}
                    onChange={(e) => setTestType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="standard">Standard IQ Test</option>
                    <option value="wais">WAIS (Wechsler Adult)</option>
                    <option value="wisc">WISC (Wechsler Child)</option>
                    <option value="stanford-binet">Stanford-Binet</option>
                    <option value="cattell">Cattell Culture Fair</option>
                  </select>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-4">
                <div className="p-3 sm:p-4 md:p-6 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                  <div className="text-sm text-purple-600 font-medium">Your Percentile Rank</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-800">{percentileRank}</div>
                  <div className="text-purple-700 mt-2">{description}</div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 rounded-lg text-center">
                    <div className="text-sm text-blue-600 font-medium">People Below You</div>
                    <div className="text-xl font-bold text-blue-800">{peopleBelow}</div>
                  </div>
                  <div className="p-4 bg-green-50 rounded-lg text-center">
                    <div className="text-sm text-green-600 font-medium">People Above You</div>
                    <div className="text-xl font-bold text-green-800">{peopleAbove}</div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg text-center">
                    <div className="text-sm text-amber-600 font-medium">Rarity</div>
                    <div className="text-xl font-bold text-amber-800">{rarity}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* IQ Scale Visual */}
            <div className="mb-4 sm:mb-6 md:mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">IQ Distribution Scale</h3>
              <div className="relative">
                <div className="w-full h-6 bg-gradient-to-r from-red-200 via-yellow-200 via-green-200 via-blue-200 to-purple-200 rounded-lg mb-2"></div>
                <div
                  className="absolute w-3 h-3 bg-red-600 rounded-full transform -translate-x-1/2 -mt-1 transition-all duration-500"
                  style={{ left: `${markerPosition}%` }}
                ></div>
                <div className="flex justify-between text-xs text-gray-600 mt-1">
                  <span>70</span>
                  <span>85</span>
                  <span>100</span>
                  <span>115</span>
                  <span>130</span>
                  <span>145</span>
                </div>
              </div>
            </div>
          </div>

          {/* IQ Classification Table */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-4">IQ Classifications</h3>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-2 py-3 text-left font-semibold">IQ Score Range</th>
                    <th className="px-2 py-3 text-left font-semibold">Classification</th>
                    <th className="px-2 py-3 text-left font-semibold">Percentile</th>
                    <th className="px-2 py-3 text-left font-semibold">Population %</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {classifications.map((item, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-2 py-3 font-medium">{item.range}</td>
                      <td className="px-2 py-3">{item.classification}</td>
                      <td className="px-2 py-3">{item.percentile}</td>
                      <td className="px-2 py-3">{item.population}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Percentile Lookup Table */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">IQ Score to Percentile Lookup</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">Common IQ Scores</h4>
                <div className="space-y-2">
                  {commonScores.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-blue-50 rounded text-sm">
                      <span className="font-medium">IQ {item.iq}:</span>
                      <span>{item.percentile}th percentile</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">High IQ Scores</h4>
                <div className="space-y-2">
                  {highScores.map((item, index) => (
                    <div key={index} className="flex justify-between p-2 bg-purple-50 rounded text-sm">
                      <span className="font-medium">IQ {item.iq}:</span>
                      <span>{item.percentile}th percentile</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="bg-purple-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-purple-800 mb-3">🧠 IQ Basics</h3>
            <div className="space-y-2 text-sm text-purple-700">
              <div><strong>Average IQ:</strong> 100</div>
              <div><strong>Standard Dev:</strong> 15 points</div>
              <div><strong>Normal Distribution:</strong> Bell curve</div>
              <div><strong>Percentile:</strong> Ranking position</div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📊 Key Percentiles</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div><strong>50th:</strong> Average (IQ 100)</div>
              <div><strong>84th:</strong> Above Average (IQ 115)</div>
              <div><strong>98th:</strong> Gifted (IQ 130)</div>
              <div><strong>99.9th:</strong> Highly Gifted (IQ 145)</div>
            </div>
          </div>

          <div className="bg-green-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-green-800 mb-3">🎯 Understanding Scores</h3>
            <ul className="space-y-2 text-sm text-green-700">
              <li>• Higher percentile = rarer score</li>
              <li>• 50th percentile = exactly average</li>
              <li>• 68% of people score 85-115</li>
              <li>• 95% of people score 70-130</li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-amber-800 mb-3">⚠️ Important Notes</h3>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>• IQ tests measure specific abilities</li>
              <li>• Scores can vary between tests</li>
              <li>• Intelligence is multifaceted</li>
              <li>• Cultural factors may influence scores</li>
            </ul>
          </div>

          <div className="bg-red-50 rounded-xl p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-bold text-red-800 mb-3">🚨 Disclaimers</h3>
            <ul className="space-y-2 text-sm text-red-700">
              <li>• This is for educational purposes only</li>
              <li>• Use professionally administered tests</li>
              <li>• IQ doesn&apos;t define worth or potential</li>
              <li>• Multiple intelligences exist</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding IQ Percentiles</h2>

        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">What is IQ?</h3>
            <p className="text-gray-600 mb-4">
              Intelligence Quotient (IQ) is a score derived from standardized tests designed to assess human intelligence.
              The modern IQ scale is set so that the average score is 100 with a standard deviation of 15.
            </p>

            <h4 className="font-semibold mb-2">Key Concepts:</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>Standardized:</strong> Scores are comparable across tests</li>
              <li>• <strong>Normal Distribution:</strong> Most people score near 100</li>
              <li>• <strong>Relative Measure:</strong> Compares to general population</li>
              <li>• <strong>Age-Adjusted:</strong> Scores account for age differences</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Percentiles Explained</h3>
            <p className="text-gray-600 mb-4">
              Percentiles indicate the percentage of the population that scored below a particular score.
              For example, an IQ of 115 is at the 84th percentile, meaning 84% of people scored lower.
            </p>

            <h4 className="font-semibold mb-2">Interpretation Guide:</h4>
            <ul className="space-y-1 text-gray-600 text-sm">
              <li>• <strong>Above 95th:</strong> Intellectually superior</li>
              <li>• <strong>75th-95th:</strong> Above average intelligence</li>
              <li>• <strong>25th-75th:</strong> Average intelligence range</li>
              <li>• <strong>5th-25th:</strong> Below average intelligence</li>
              <li>• <strong>Below 5th:</strong> Significantly below average</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="iq-percentile-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
