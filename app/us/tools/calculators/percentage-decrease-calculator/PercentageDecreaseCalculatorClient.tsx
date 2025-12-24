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
    question: "What is a Percentage Decrease Calculator?",
    answer: "A Percentage Decrease Calculator is a mathematical tool that helps you quickly calculate or convert percentage decrease-related values. It eliminates manual calculations and provides instant, accurate results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Percentage Decrease Calculator?",
    answer: "Simply enter your values in the input fields provided. The calculator will automatically compute and display the results. You can adjust values to see how changes affect the outcome.",
    order: 2
  },
  {
    id: '3',
    question: "Are the results accurate?",
    answer: "Yes, our Percentage Decrease Calculator uses precise mathematical formulas to ensure accurate results. The calculations follow standard mathematical conventions and formulas.",
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
    answer: "Yes, this Percentage Decrease Calculator is completely free to use with no registration required. Use it as many times as you need for your calculations.",
    order: 5
  }
];

export default function PercentageDecreaseCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Main calculation
  const { getH1, getSubHeading } = usePageSEO('percentage-decrease-calculator');

  const [originalValue, setOriginalValue] = useState(100);
  const [newValue, setNewValue] = useState(80);

  // Alternative calculations
  const [altOriginal, setAltOriginal] = useState(100);
  const [altPercentage, setAltPercentage] = useState(25);
  const [altResult, setAltResult] = useState('75.00');

  const [reverseNew, setReverseNew] = useState(75);
  const [reversePercentage, setReversePercentage] = useState(25);
  const [reverseOriginal, setReverseOriginal] = useState('100.00');

  // Results
  const [percentageDecrease, setPercentageDecrease] = useState('20.00%');
  const [decreaseAmount, setDecreaseAmount] = useState('20.00');
  const [remainingPercentage, setRemainingPercentage] = useState('80.00%');
  const [stepBySolution, setStepBySolution] = useState<string[]>([]);

  const calculatePercentageDecrease = () => {
    const original = originalValue || 0;
    const newVal = newValue || 0;

    if (original === 0) {
      setPercentageDecrease('0%');
      setDecreaseAmount('0');
      setRemainingPercentage('100%');
      return;
    }

    const decrease = original - newVal;
    const pctDecrease = (decrease / original) * 100;
    const remainingPct = (newVal / original) * 100;

    setPercentageDecrease(pctDecrease >= 0 ? `${pctDecrease.toFixed(2)}%` : 'Invalid (increase)');
    setDecreaseAmount(decrease.toFixed(2));
    setRemainingPercentage(`${Math.abs(remainingPct).toFixed(2)}%`);

    generateStepBySolution(original, newVal, pctDecrease, decrease);
  };

  const generateStepBySolution = (original: number, newVal: number, percentage: number, decrease: number) => {
    const steps = [
      `Step 1: Identify the values - Original: ${original}, New: ${newVal}`,
      `Step 2: Calculate the decrease - ${original} - ${newVal} = ${decrease.toFixed(2)}`,
      `Step 3: Apply the formula - (${decrease.toFixed(2)} / ${original}) x 100 = ${percentage.toFixed(2)}%`,
      `Result: The value decreased by ${Math.abs(percentage).toFixed(2)}%`
    ];
    setStepBySolution(steps);
  };

  const calculateNewValue = () => {
    const original = altOriginal || 0;
    const percentage = altPercentage || 0;
    const newVal = original * (1 - percentage / 100);
    setAltResult(newVal.toFixed(2));
  };

  const calculateOriginalValue = () => {
    const newVal = reverseNew || 0;
    const percentage = reversePercentage || 0;

    if (percentage >= 100) {
      setReverseOriginal('Invalid');
      return;
    }

    const original = newVal / (1 - percentage / 100);
    setReverseOriginal(original.toFixed(2));
  };

  useEffect(() => {
    calculatePercentageDecrease();
  }, [originalValue, newValue]);

  useEffect(() => {
    calculateNewValue();
  }, [altOriginal, altPercentage]);

  useEffect(() => {
    calculateOriginalValue();
  }, [reverseNew, reversePercentage]);

  const retailExamples = [
    { desc: 'Shirt: $40 → $30', calc: '25% off' },
    { desc: 'Shoes: $120 → $90', calc: '25% discount' },
    { desc: 'Phone: $800 → $600', calc: '25% reduction' },
    { desc: 'Laptop: $1000 → $750', calc: '25% off' }
  ];

  const businessExamples = [
    { desc: 'Sales: $100k → $80k', calc: '20% decline' },
    { desc: 'Costs: $50k → $40k', calc: '20% savings' },
    { desc: 'Staff: 100 → 85', calc: '15% reduction' },
    { desc: 'Profit: $20k → $15k', calc: '25% decrease' }
  ];

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Percentage Decrease Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Percentage Decrease Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Calculate percentage decrease, find discounts, and analyze reductions</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2">
          {/* Main Calculation */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Percentage Decrease
            </h2>

            <div className="grid md:grid-cols-2 gap-3 md:gap-4 mb-4 md:mb-6">
              <div>
                <label htmlFor="originalValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">Original Value (Before)</label>
                <input
                  type="number"
                  id="originalValue"
                  step="0.01"
                  value={originalValue}
                  onChange={(e) => setOriginalValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              <div>
                <label htmlFor="newValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-1 md:mb-2">New Value (After)</label>
                <input
                  type="number"
                  id="newValue"
                  step="0.01"
                  value={newValue}
                  onChange={(e) => setNewValue(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="p-3 md:p-4 bg-gradient-to-br from-red-50 to-rose-50 rounded-lg border-2 border-red-200">
                <div className="text-xs md:text-sm text-red-600 font-medium mb-1">Percentage Decrease</div>
                <div className="text-xl md:text-2xl font-bold text-red-800">{percentageDecrease}</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="text-xs md:text-sm text-blue-600 font-medium mb-1">Decrease Amount</div>
                <div className="text-xl md:text-2xl font-bold text-blue-800">{decreaseAmount}</div>
              </div>
              <div className="p-3 md:p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg border-2 border-green-200">
                <div className="text-xs md:text-sm text-green-600 font-medium mb-1">Remaining %</div>
                <div className="text-xl md:text-2xl font-bold text-green-800">{remainingPercentage}</div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Alternative Calculations */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Alternative Calculations
            </h3>

            {/* Find New Value from Percentage */}
            <div className="mb-4 md:mb-6 p-3 md:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Find New Value from Percentage Decrease</h4>
              <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Original Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={altOriginal}
                    onChange={(e) => setAltOriginal(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Decrease % (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={altPercentage}
                    onChange={(e) => setAltPercentage(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">New Value</label>
                  <input
                    type="text"
                    readOnly
                    value={altResult}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
              </div>
            </div>

            {/* Find Original Value */}
            <div className="p-3 md:p-4 bg-gray-50 rounded-lg">
              <h4 className="font-semibold text-gray-900 mb-2 md:mb-3 text-sm md:text-base">Find Original Value from New Value and Percentage</h4>
              <div className="grid md:grid-cols-3 gap-3 md:gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">New Value</label>
                  <input
                    type="number"
                    step="0.01"
                    value={reverseNew}
                    onChange={(e) => setReverseNew(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Decrease % (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={reversePercentage}
                    onChange={(e) => setReversePercentage(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-1">Original Value</label>
                  <input
                    type="text"
                    readOnly
                    value={reverseOriginal}
                    className="w-full px-3 py-2 text-sm md:text-base border border-gray-300 rounded-lg bg-gray-100 text-gray-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Step-by-Step Solution
            </h3>
            <div className="space-y-2 md:space-y-3 text-xs md:text-sm">
              {stepBySolution.map((step, index) => (
                <div key={index} className={`p-2 md:p-3 rounded border ${
                  index === 0 ? 'bg-blue-50 border-blue-200' :
                  index === 1 ? 'bg-green-50 border-green-200' :
                  index === 2 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-purple-50 border-purple-200'
                }`}>
                  {step}
                </div>
              ))}
            </div>
          </div>
{/* Examples */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              Common Examples
            </h3>

            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Retail & Sales</h4>
                <div className="space-y-2">
                  {retailExamples.map((ex, i) => (
                    <div key={i} className="p-2 bg-gradient-to-br from-green-50 to-emerald-50 rounded border border-green-200 text-xs md:text-sm">
                      <div className="font-medium text-gray-900">{ex.desc}</div>
                      <div className="text-gray-600 text-xs">{ex.calc}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 md:mb-3 text-sm md:text-base">Business & Finance</h4>
                <div className="space-y-2">
                  {businessExamples.map((ex, i) => (
                    <div key={i} className="p-2 bg-gradient-to-br from-blue-50 to-indigo-50 rounded border border-blue-200 text-xs md:text-sm">
                      <div className="font-medium text-gray-900">{ex.desc}</div>
                      <div className="text-gray-600 text-xs">{ex.calc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 md:p-6 border border-red-200">
            <h3 className="text-base md:text-lg font-bold text-red-900 mb-2 md:mb-3">Key Concepts</h3>
            <div className="space-y-1.5 text-xs md:text-sm text-red-800">
              <div><strong>Decrease:</strong> Value gets smaller</div>
              <div><strong>Negative Change:</strong> Always negative %</div>
              <div><strong>Reduction:</strong> Amount taken away</div>
              <div><strong>Discount:</strong> Price reduction</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
            <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2 md:mb-3">Quick Tips</h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-blue-800">
              <li>• New value must be smaller than original</li>
              <li>• Result is always positive percentage</li>
              <li>• 50% decrease = half the original</li>
              <li>• Cannot decrease by more than 100%</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200">
            <h3 className="text-base md:text-lg font-bold text-green-900 mb-2 md:mb-3">Common Uses</h3>
            <ul className="space-y-1.5 text-xs md:text-sm text-green-800">
              <li>• Sales discounts</li>
              <li>• Weight loss tracking</li>
              <li>• Price reductions</li>
              <li>• Performance analysis</li>
              <li>• Budget cuts</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3">Quick Reference</h3>
            <div className="space-y-1.5 text-xs md:text-sm text-amber-800">
              <div><strong>10% off:</strong> Pay 90%</div>
              <div><strong>25% off:</strong> Pay 75%</div>
              <div><strong>50% off:</strong> Pay 50%</div>
              <div><strong>75% off:</strong> Pay 25%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Educational Content */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4 md:mb-6">
          Understanding Percentage Decrease
        </h2>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8">
          <div>
            <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-3 text-gray-900">What is Percentage Decrease?</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
              Percentage decrease represents how much a value has reduced relative to its original amount,
              expressed as a percentage. It&apos;s commonly used in business, finance, and everyday calculations.
            </p>

            <h4 className="font-semibold mb-1.5 md:mb-2 text-xs md:text-sm text-gray-900">Key Points:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• Always results in a positive percentage value</li>
              <li>• The original value is the baseline (100%)</li>
              <li>• Cannot exceed 100% (would mean negative value)</li>
              <li>• Often expressed as &quot;X% off&quot; or &quot;X% reduction&quot;</li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm md:text-base font-semibold mb-2 md:mb-3 text-gray-900">Practical Applications</h3>
            <p className="text-xs md:text-sm text-gray-600 mb-3 md:mb-4">
              Understanding percentage decrease is essential for comparing changes, calculating discounts,
              analyzing performance metrics, and making informed financial decisions.
            </p>

            <h4 className="font-semibold mb-1.5 md:mb-2 text-xs md:text-sm text-gray-900">Real-World Examples:</h4>
            <ul className="space-y-1 text-xs text-gray-600">
              <li>• <strong>Retail:</strong> Sale prices and discount calculations</li>
              <li>• <strong>Finance:</strong> Investment losses and value depreciation</li>
              <li>• <strong>Health:</strong> Weight loss progress tracking</li>
              <li>• <strong>Business:</strong> Cost reduction and efficiency gains</li>
              <li>• <strong>Statistics:</strong> Data analysis and trend identification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">%</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="percentage-decrease-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
