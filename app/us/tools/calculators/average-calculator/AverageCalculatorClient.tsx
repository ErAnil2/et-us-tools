'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Results {
  mean: number;
  median: number;
  mode: string;
  count: number;
  sum: number;
  min: number;
  max: number;
  range: number;
  stdDev: number;
  sorted: number[];
}

export default function AverageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('average-calculator');

  const [numbers, setNumbers] = useState('10, 15, 20, 25, 30, 35, 40');
  const [results, setResults] = useState<Results>({
    mean: 0,
    median: 0,
    mode: 'No Mode',
    count: 0,
    sum: 0,
    min: 0,
    max: 0,
    range: 0,
    stdDev: 0,
    sorted: []
  });

  const parseNumbers = (input: string): number[] => {
    return input.split(/[,\s]+/)
      .map(n => n.trim())
      .filter(n => n !== '')
      .map(n => parseFloat(n))
      .filter(n => !isNaN(n));
  };

  const calculateMean = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    return nums.reduce((a, b) => a + b, 0) / nums.length;
  };

  const calculateMedian = (nums: number[]): number => {
    if (nums.length === 0) return 0;
    const sorted = [...nums].sort((a, b) => a - b);
    const middle = Math.floor(sorted.length / 2);
    if (sorted.length % 2 === 0) {
      return (sorted[middle - 1] + sorted[middle]) / 2;
    }
    return sorted[middle];
  };

  const calculateMode = (nums: number[]): string => {
    if (nums.length === 0) return 'No Mode';
    const frequency: Record<number, number> = {};
    nums.forEach(num => {
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
    return maxFreq > 1 ? modes.join(', ') : 'No Mode';
  };

  const calculateStdDev = (nums: number[], mean: number): number => {
    if (nums.length === 0) return 0;
    const variance = nums.reduce((sum, num) => sum + Math.pow(num - mean, 2), 0) / nums.length;
    return Math.sqrt(variance);
  };

  const calculateAll = () => {
    const nums = parseNumbers(numbers);

    if (nums.length === 0) {
      setResults({
        mean: 0,
        median: 0,
        mode: 'No Mode',
        count: 0,
        sum: 0,
        min: 0,
        max: 0,
        range: 0,
        stdDev: 0,
        sorted: []
      });
      return;
    }

    const mean = calculateMean(nums);
    const median = calculateMedian(nums);
    const mode = calculateMode(nums);
    const sum = nums.reduce((a, b) => a + b, 0);
    const min = Math.min(...nums);
    const max = Math.max(...nums);
    const range = max - min;
    const sorted = [...nums].sort((a, b) => a - b);
    const stdDev = calculateStdDev(nums, mean);

    setResults({
      mean,
      median,
      mode,
      count: nums.length,
      sum,
      min,
      max,
      range,
      stdDev,
      sorted
    });
  };

  useEffect(() => {
    calculateAll();
  }, [numbers]);

  const exampleDatasets = [
    { label: 'Test Scores', data: '85, 90, 78, 92, 88, 95, 82, 89, 91, 87' },
    { label: 'Temperatures', data: '72, 75, 68, 80, 77, 73, 71' },
    { label: 'Sales ($)', data: '150, 230, 180, 290, 210, 175, 195' },
    { label: 'Ages', data: '25, 32, 28, 45, 38, 29, 35, 42' },
  ];

  const fallbackFaqs = [
    {
      id: '1',
      question: "What's the difference between mean, median, and mode?",
      answer: "Mean (average) is the sum of all values divided by the count. Median is the middle value when data is sorted. Mode is the most frequently occurring value. Each measure is useful in different situations - median is better for skewed data, mode for categorical data.",
      order: 1
    },
    {
      id: '2',
      question: "When should I use weighted average?",
      answer: "Use weighted average when some values are more important than others. Common examples: calculating GPA (courses have different credits), stock portfolio returns (different investment amounts), or survey results (different sample sizes).",
      order: 2
    },
    {
      id: '3',
      question: "What is geometric mean used for?",
      answer: "Geometric mean is used for data involving percentages, growth rates, or ratios. It's ideal for compound interest calculations, population growth rates, investment returns over time, and any multiplicative processes.",
      order: 3
    },
    {
      id: '4',
      question: "What is harmonic mean used for?",
      answer: "Harmonic mean is best for averaging rates or ratios, such as average speed when distances are equal, price-earnings ratios, or any situation involving rates that need to be combined.",
      order: 4
    },
    {
      id: '5',
      question: "What does standard deviation tell me?",
      answer: "Standard deviation measures how spread out the data is from the mean. A low standard deviation means values are clustered close to the mean, while a high standard deviation means values are more spread out. About 68% of data falls within one standard deviation of the mean in a normal distribution.",
      order: 5
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{getH1('Average Calculator')}</h1>
          <p className="text-gray-600">Calculate mean, median, mode, and other statistics</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Numbers</h2>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Numbers (separated by commas or spaces)
                </label>
                <textarea
                  value={numbers}
                  onChange={(e) => setNumbers(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                  placeholder="e.g., 10, 20, 30, 40, 50"
                />
              </div>

              {/* Example Datasets */}
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Example datasets:</p>
                <div className="flex flex-wrap gap-2">
                  {exampleDatasets.map((example, index) => (
                    <button
                      key={index}
                      onClick={() => setNumbers(example.data)}
                      className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-md text-gray-700 transition-colors"
                    >
                      {example.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Results</h2>

              {/* Primary Result */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-100 mb-4">
                <div className="text-center">
                  <div className="text-sm text-blue-600 mb-1">Mean (Average)</div>
                  <div className="text-4xl font-bold text-blue-700">{results.mean.toFixed(2)}</div>
                </div>
              </div>

              {/* Central Tendency */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-green-50 rounded-lg p-3 border border-green-100">
                  <div className="text-xs text-green-600 mb-1">Median</div>
                  <div className="text-xl font-bold text-green-800">{results.median.toFixed(2)}</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                  <div className="text-xs text-purple-600 mb-1">Mode</div>
                  <div className="text-xl font-bold text-purple-800 truncate">{results.mode}</div>
                </div>
              </div>

              {/* Data Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Data Summary</h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Count:</span>
                    <span className="font-medium text-gray-800">{results.count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Sum:</span>
                    <span className="font-medium text-gray-800">{results.sum.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Min:</span>
                    <span className="font-medium text-gray-800">{results.min.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Max:</span>
                    <span className="font-medium text-gray-800">{results.max.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Range:</span>
                    <span className="font-medium text-gray-800">{results.range.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Std Dev:</span>
                    <span className="font-medium text-gray-800">{results.stdDev.toFixed(4)}</span>
                  </div>
                </div>
              </div>

              {/* Sorted Data */}
              {results.sorted.length > 0 && (
                <div className="mt-4 bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Sorted Values</div>
                  <div className="text-sm font-mono text-gray-700 max-h-16 overflow-y-auto">
                    {results.sorted.join(', ')}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />


        {/* Understanding Averages */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Understanding Averages</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Mean</h3>
              <p className="text-sm text-blue-700 mb-2">Sum of values divided by count</p>
              <code className="text-xs text-blue-600 bg-blue-100 px-2 py-1 rounded">x̄ = Σx / n</code>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">Median</h3>
              <p className="text-sm text-green-700 mb-2">Middle value when data is sorted</p>
              <p className="text-xs text-green-600">Best for skewed distributions</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <h3 className="font-semibold text-purple-800 mb-2">Mode</h3>
              <p className="text-sm text-purple-700 mb-2">Most frequently occurring value</p>
              <p className="text-xs text-purple-600">Can have multiple modes</p>
            </div>
          </div>
        </div>

        {/* Formulas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistical Formulas</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Measure</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Formula</th>
                  <th className="py-2 px-3 text-left font-medium text-gray-700">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr>
                  <td className="py-2 px-3 font-medium">Mean</td>
                  <td className="py-2 px-3 font-mono text-xs">(x₁ + x₂ + ... + xₙ) / n</td>
                  <td className="py-2 px-3 text-gray-600">Sum divided by count</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Range</td>
                  <td className="py-2 px-3 font-mono text-xs">max - min</td>
                  <td className="py-2 px-3 text-gray-600">Spread of data</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Variance</td>
                  <td className="py-2 px-3 font-mono text-xs">Σ(xᵢ - x̄)² / n</td>
                  <td className="py-2 px-3 text-gray-600">Average squared deviation</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">Std Dev</td>
                  <td className="py-2 px-3 font-mono text-xs">√(Variance)</td>
                  <td className="py-2 px-3 text-gray-600">Spread from the mean</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
{/* When to Use Each */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">When to Use Each Average</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Use Mean when:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Data is normally distributed
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  No extreme outliers
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  Calculating weighted averages
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-medium text-gray-800 mb-2">Use Median when:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Data has outliers
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Data is skewed
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Finding the "typical" value
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
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
        {/* Mobile MREC2 - Before FAQs */}

        <CalculatorMobileMrec2 />


        {/* FAQs */}
        <FirebaseFAQs
          pageId="average-calculator"
          fallbackFaqs={fallbackFaqs}
        />
      </div>
    </div>
  );
}
