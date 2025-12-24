'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

interface StatisticsCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface StatisticsResults {
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  mean: number;
  median: number;
  mode: string;
  stdDev: number;
  variance: number;
  q1: number;
  q2: number;
  q3: number;
  iqr: number;
  standardError: number;
  coefficientVariation: number;
  skewness: number;
  kurtosis: number;
  distributionShape: string;
  ciLower: number;
  ciUpper: number;
  sortedData: number[];
  geometricMean: number;
  harmonicMean: number;
}

interface HistoryItem {
  dataSet: string;
  mean: number;
  stdDev: number;
  timestamp: Date;
}

type AnalysisType = 'descriptive' | 'central' | 'spread' | 'distribution';

export default function StatisticsCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: StatisticsCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('statistics-calculator');

  const [dataSet, setDataSet] = useState('12, 15, 18, 20, 22, 25, 28, 30, 32, 35');
  const [calcType, setCalcType] = useState<'sample' | 'population'>('sample');
  const [analysisType, setAnalysisType] = useState<AnalysisType>('descriptive');
  const [results, setResults] = useState<StatisticsResults | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const analysisTypes = [
    { value: 'descriptive' as AnalysisType, label: 'Full Analysis', emoji: '📊', description: 'All statistics' },
    { value: 'central' as AnalysisType, label: 'Central Tendency', emoji: '🎯', description: 'Mean, median, mode' },
    { value: 'spread' as AnalysisType, label: 'Dispersion', emoji: '📈', description: 'Variance, std dev' },
    { value: 'distribution' as AnalysisType, label: 'Distribution', emoji: '🔔', description: 'Shape analysis' },
  ];

  const parseData = (input: string): number[] => {
    return input.split(/[,\s]+/)
      .map(n => n.trim())
      .filter(n => n !== '')
      .map(n => parseFloat(n))
      .filter(n => !isNaN(n));
  };

  const getPercentile = (sortedData: number[], percentile: number): number => {
    const index = (percentile / 100) * (sortedData.length - 1);
    const lower = Math.floor(index);
    const upper = Math.ceil(index);
    const weight = index % 1;

    if (upper >= sortedData.length) return sortedData[sortedData.length - 1];
    return sortedData[lower] * (1 - weight) + sortedData[upper] * weight;
  };

  const calculateStatistics = () => {
    const input = dataSet.trim();
    const data = parseData(input);

    if (data.length === 0) {
      setResults(null);
      return;
    }

    const sortedData = [...data].sort((a, b) => a - b);
    const count = data.length;
    const sum = data.reduce((a, b) => a + b, 0);
    const mean = sum / count;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min;

    // Median
    const median = count % 2 === 0
      ? (sortedData[count / 2 - 1] + sortedData[count / 2]) / 2
      : sortedData[Math.floor(count / 2)];

    // Mode
    const frequency: { [key: number]: number } = {};
    data.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1;
    });

    let maxFreq = 0;
    let modes: number[] = [];
    for (const num in frequency) {
      if (frequency[num] > maxFreq) {
        maxFreq = frequency[num];
        modes = [parseFloat(num)];
      } else if (frequency[num] === maxFreq && frequency[num] > 1) {
        modes.push(parseFloat(num));
      }
    }
    const mode = maxFreq > 1 ? modes.join(', ') : 'No Mode';

    // Variance and Standard Deviation
    const divisor = calcType === 'sample' ? count - 1 : count;
    const variance = data.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / divisor;
    const stdDev = Math.sqrt(variance);

    // Quartiles
    const q1 = getPercentile(sortedData, 25);
    const q2 = median;
    const q3 = getPercentile(sortedData, 75);
    const iqr = q3 - q1;

    // Advanced measures
    const standardError = stdDev / Math.sqrt(count);
    const coefficientVariation = mean !== 0 ? (stdDev / Math.abs(mean)) * 100 : 0;

    // Skewness (Pearson's)
    const skewness = stdDev !== 0 ? (3 * (mean - median)) / stdDev : 0;

    // Kurtosis
    const meanDiff4 = data.reduce((acc, val) => acc + Math.pow(val - mean, 4), 0) / count;
    const kurtosis = stdDev !== 0 ? meanDiff4 / Math.pow(stdDev, 4) - 3 : 0;

    // Distribution shape
    let distributionShape;
    if (Math.abs(skewness) < 0.5) distributionShape = 'Approximately Symmetric';
    else if (skewness > 0.5) distributionShape = 'Right Skewed (Positive)';
    else distributionShape = 'Left Skewed (Negative)';

    // Confidence interval (95%)
    const tValue = 1.96; // Z-value for 95% CI
    const marginError = tValue * standardError;
    const ciLower = mean - marginError;
    const ciUpper = mean + marginError;

    // Geometric Mean (only for positive values)
    const allPositive = data.every(n => n > 0);
    const geometricMean = allPositive
      ? Math.pow(data.reduce((acc, val) => acc * val, 1), 1 / count)
      : 0;

    // Harmonic Mean (only for positive values)
    const harmonicMean = allPositive
      ? count / data.reduce((acc, val) => acc + (1 / val), 0)
      : 0;

    setResults({
      count, sum, min, max, range, mean, median, mode,
      stdDev, variance, q1, q2, q3, iqr,
      standardError, coefficientVariation, skewness, kurtosis,
      distributionShape, ciLower, ciUpper, sortedData,
      geometricMean, harmonicMean
    });

    // Add to history
    const historyItem: HistoryItem = {
      dataSet: data.length > 5 ? `${data.slice(0, 5).join(', ')}... (${count} values)` : data.join(', '),
      mean,
      stdDev,
      timestamp: new Date()
    };
    setHistory(prev => [historyItem, ...prev].slice(0, 10));
  };

  const loadExample = (data: string, name: string) => {
    setDataSet(data);
  };

  const clearHistory = () => setHistory([]);

  useEffect(() => {
    calculateStatistics();
  }, [dataSet, calcType]);

  const exampleDataSets = [
    { name: 'Test Scores', data: '85, 90, 78, 92, 88, 95, 82, 89, 91, 87', desc: 'Class grades' },
    { name: 'Heights (cm)', data: '165, 170, 172, 168, 175, 180, 162, 177, 169, 173', desc: 'Height data' },
    { name: 'Response Time', data: '2.3, 1.8, 3.1, 2.7, 1.9, 2.5, 3.4, 2.1, 2.8, 3.0', desc: 'Seconds' },
    { name: 'Sales Data', data: '1200, 1450, 980, 1780, 1350, 1600, 1100, 1890, 1250, 1500', desc: 'Revenue' },
    { name: 'Temperature', data: '72, 75, 68, 71, 76, 73, 69, 74, 70, 77', desc: 'Fahrenheit' },
    { name: 'Bimodal', data: '10, 10, 10, 20, 20, 20, 50, 50, 50, 60, 60, 60', desc: 'Two peaks' },
  ];

  const fallbackFaqs = [
    {
    id: '1',
    question: "What's the difference between sample and population statistics?",
      answer: "Sample statistics use n-1 in the denominator (Bessel's correction) for variance and standard deviation, providing an unbiased estimate of population parameters. Population statistics use n when you have data for the entire population. Use 'Sample' for most real-world data.",
    order: 1
  },
    {
    id: '2',
    question: "What is standard deviation and why is it important?",
      answer: "Standard deviation measures how spread out values are from the mean. Low standard deviation means values cluster near the mean; high means they're spread out. It's used in quality control, research, finance (risk), and any field needing to understand data variability.",
    order: 2
  },
    {
    id: '3',
    question: "What's the difference between mean, median, and mode?",
      answer: "Mean is the arithmetic average. Median is the middle value when data is sorted (better for skewed data or outliers). Mode is the most frequent value (useful for categorical data). For symmetric distributions, all three are similar.",
    order: 3
  },
    {
    id: '4',
    question: "What does skewness tell us?",
      answer: "Skewness measures distribution asymmetry. Positive skewness: tail extends right (mean > median), common in income data. Negative skewness: tail extends left (mean < median). Near-zero skewness indicates symmetry.",
    order: 4
  },
    {
    id: '5',
    question: "What is coefficient of variation (CV)?",
      answer: "CV is standard deviation divided by mean, expressed as a percentage. It allows comparing variability between datasets with different scales or units. Lower CV means less relative variation. Useful when comparing consistency across different measurements.",
    order: 5
  }
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">{getH1('Statistics Calculator')}</h1>
        <p className="text-gray-600">Calculate mean, median, mode, standard deviation, and comprehensive statistical measures</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Analysis Type Selection */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">Analysis Type</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {analysisTypes.map((type) => (
            <button
              key={type.value}
              onClick={() => setAnalysisType(type.value)}
              className={`p-3 rounded-lg border-2 transition-all ${
                analysisType === type.value
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="text-2xl mb-1">{type.emoji}</div>
              <div className="text-sm font-medium">{type.label}</div>
              <div className="text-xs opacity-70">{type.description}</div>
            </button>
          ))}
        </div>
      </div>
{/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {/* Calculator Section */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Data Input */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Data Input</h3>

            <div className="space-y-4">
              <div>
                <label htmlFor="dataSet" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter numbers (comma or space separated)
                </label>
                <textarea
                  id="dataSet"
                  rows={4}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none font-mono"
                  placeholder="e.g., 10, 15, 20, 25, 30, 35, 40"
                  value={dataSet}
                  onChange={(e) => setDataSet(e.target.value)}
                />
              </div>

              <div className="flex gap-4 items-center">
                <span className="text-sm font-medium text-gray-700">Calculation Type:</span>
                <div className="flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="calcType"
                      checked={calcType === 'sample'}
                      onChange={() => setCalcType('sample')}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm">Sample (n-1)</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="calcType"
                      checked={calcType === 'population'}
                      onChange={() => setCalcType('population')}
                      className="text-blue-600"
                    />
                    <span className="ml-2 text-sm">Population (n)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Example Data Sets */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-700 mb-3">Quick Examples</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {exampleDataSets.map((example, idx) => (
                  <button
                    key={idx}
                    onClick={() => loadExample(example.data, example.name)}
                    className="p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="font-medium text-gray-800 text-sm">{example.name}</div>
                    <div className="text-xs text-gray-500">{example.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Display */}
          {results && (
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">📈 Statistical Results</h3>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Central Tendency */}
                {(analysisType === 'descriptive' || analysisType === 'central') && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-3">Central Tendency</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Mean:</span>
                        <span className="font-bold text-blue-900">{results.mean.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Median:</span>
                        <span className="font-bold text-blue-900">{results.median.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">Mode:</span>
                        <span className="font-bold text-blue-900">{results.mode}</span>
                      </div>
                      {results.geometricMean > 0 && (
                        <div className="flex justify-between">
                          <span className="text-blue-700">Geometric Mean:</span>
                          <span className="font-bold text-blue-900">{results.geometricMean.toFixed(4)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Dispersion */}
                {(analysisType === 'descriptive' || analysisType === 'spread') && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-3">Dispersion</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-700">Std Deviation:</span>
                        <span className="font-bold text-green-900">{results.stdDev.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Variance:</span>
                        <span className="font-bold text-green-900">{results.variance.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">Range:</span>
                        <span className="font-bold text-green-900">{results.range.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-700">CV:</span>
                        <span className="font-bold text-green-900">{results.coefficientVariation.toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quartiles */}
                {(analysisType === 'descriptive' || analysisType === 'spread') && (
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-3">Quartiles</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-purple-700">Q1 (25%):</span>
                        <span className="font-bold text-purple-900">{results.q1.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Q2 (50%):</span>
                        <span className="font-bold text-purple-900">{results.q2.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">Q3 (75%):</span>
                        <span className="font-bold text-purple-900">{results.q3.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-700">IQR:</span>
                        <span className="font-bold text-purple-900">{results.iqr.toFixed(4)}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Distribution */}
                {(analysisType === 'descriptive' || analysisType === 'distribution') && (
                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-3">Distribution Shape</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-orange-700">Skewness:</span>
                        <span className="font-bold text-orange-900">{results.skewness.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Kurtosis:</span>
                        <span className="font-bold text-orange-900">{results.kurtosis.toFixed(4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-orange-700">Shape:</span>
                        <span className="font-bold text-orange-900 text-xs">{results.distributionShape}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Data Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-3">Data Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Count:</span>
                      <span className="font-bold text-gray-900">{results.count}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sum:</span>
                      <span className="font-bold text-gray-900">{results.sum.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Min:</span>
                      <span className="font-bold text-gray-900">{results.min.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Max:</span>
                      <span className="font-bold text-gray-900">{results.max.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {/* Confidence Interval */}
                <div className="p-4 bg-teal-50 rounded-lg">
                  <h4 className="font-semibold text-teal-800 mb-3">Confidence Interval</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-teal-700">Std Error:</span>
                      <span className="font-bold text-teal-900">{results.standardError.toFixed(4)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-teal-700">95% CI:</span>
                      <span className="font-bold text-teal-900 text-xs">
                        [{results.ciLower.toFixed(2)}, {results.ciUpper.toFixed(2)}]
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Sorted Data Display */}
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-800 mb-2">Sorted Data</h4>
                <div className="text-sm font-mono text-gray-600 break-all">
                  {results.sortedData.join(', ')}
                </div>
              </div>
            </div>
)}

          {/* Mobile MREC2 - Before FAQs */}


          <CalculatorMobileMrec2 />



          {/* FAQ Section */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">❓ Frequently Asked Questions</h3>
            <div className="space-y-3">
              {fallbackFaqs.map((faq, index) => (
                <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 flex justify-between items-center transition-colors"
                    onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  >
                    <span className="font-medium text-gray-800">{faq.question}</span>
                    <span className="text-gray-500 text-xl">
                      {openFaqIndex === index ? '−' : '+'}
                    </span>
                  </button>
                  {openFaqIndex === index && (
                    <div className="px-4 py-3 bg-white text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          {/* Primary Result */}
          {results && (
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Summary Statistics</h3>

              <div className="text-center p-4 bg-white/20 rounded-lg backdrop-blur mb-4">
                <div className="text-sm opacity-80">Mean (Average)</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold font-mono">{results.mean.toFixed(4)}</div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Std Dev</div>
                  <div className="font-bold font-mono">{results.stdDev.toFixed(3)}</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Median</div>
                  <div className="font-bold font-mono">{results.median.toFixed(3)}</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Min</div>
                  <div className="font-bold font-mono">{results.min}</div>
                </div>
                <div className="text-center p-2 bg-white/10 rounded">
                  <div className="text-xs opacity-70">Max</div>
                  <div className="font-bold font-mono">{results.max}</div>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold text-gray-900">📋 History</h3>
              {history.length > 0 && (
                <button onClick={clearHistory} className="text-sm text-red-500 hover:text-red-700">
                  Clear
                </button>
              )}
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {history.length === 0 ? (
                <p className="text-gray-500 text-sm text-center py-4">No calculations yet</p>
              ) : (
                history.map((item, idx) => (
                  <div key={idx} className="p-2 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="text-xs text-gray-500 truncate">{item.dataSet}</div>
                    <div className="flex justify-between text-sm">
                      <span>Mean: <strong>{item.mean.toFixed(2)}</strong></span>
                      <span>SD: <strong>{item.stdDev.toFixed(2)}</strong></span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Reference */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="text-lg font-bold text-blue-800 mb-3">📚 Quick Reference</h3>
            <div className="space-y-2 text-sm text-blue-700">
              <div><strong>Mean:</strong> Sum / Count</div>
              <div><strong>Variance:</strong> Avg squared deviations</div>
              <div><strong>Std Dev:</strong> √Variance</div>
              <div><strong>CV:</strong> (StdDev / Mean) × 100</div>
              <div><strong>IQR:</strong> Q3 - Q1</div>
            </div>
          </div>
{/* Related Calculators */}
          <div className="bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Related Calculators</h3>
            <div className="grid grid-cols-2 gap-2">
              {relatedCalculators.map((calc, idx) => (
                <Link
                  key={idx}
                  href={calc.href}
                  className="p-3 rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all group"
                >
                  <div className={`w-8 h-8 ${calc.color} rounded-lg mb-2 flex items-center justify-center text-white text-sm font-bold`}>
                    {calc.title.charAt(0)}
                  </div>
                  <div className="text-sm font-medium text-gray-800 group-hover:text-blue-600">{calc.title}</div>
                  <div className="text-xs text-gray-500">{calc.description}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Central Tendency</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Mean:</strong> Average of all values</li>
            <li><strong>Median:</strong> Middle value (robust to outliers)</li>
            <li><strong>Mode:</strong> Most frequent value</li>
            <li><strong>Geometric Mean:</strong> For rates of change</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Measures of Spread</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Range:</strong> Max - Min</li>
            <li><strong>Variance:</strong> Average squared deviation</li>
            <li><strong>Std Deviation:</strong> Typical deviation from mean</li>
            <li><strong>IQR:</strong> Middle 50% spread</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Distribution Shape</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Skewness:</strong> Asymmetry direction</li>
            <li><strong>Kurtosis:</strong> Tail heaviness</li>
            <li><strong>Normal:</strong> Bell curve shape</li>
            <li><strong>Outliers:</strong> Beyond 1.5×IQR</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="font-bold text-gray-900 mb-3">Applications</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li><strong>Quality Control:</strong> Process monitoring</li>
            <li><strong>Research:</strong> Data analysis</li>
            <li><strong>Finance:</strong> Risk assessment</li>
            <li><strong>Education:</strong> Grade analysis</li>
          </ul>
        </div>
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <p className="text-sm text-gray-600 text-center">
          <strong>Disclaimer:</strong> This calculator is for educational purposes. Results are based on standard statistical formulas. For critical research or decision-making, verify calculations independently.
        </p>
      </div>
    </div>
  );
}
