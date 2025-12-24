'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Script from 'next/script';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Freelance Rate Calculator?",
    answer: "A Freelance Rate Calculator is a free online tool designed to help you quickly and accurately calculate freelance rate-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Freelance Rate Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Freelance Rate Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Freelance Rate Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function FreelanceRateCalculatorClient() {
  const rateChartRef = useRef<HTMLCanvasElement>(null);
  const incomeChartRef = useRef<HTMLCanvasElement>(null);
  const [rateChartInstance, setRateChartInstance] = useState<any>(null);
  const [incomeChartInstance, setIncomeChartInstance] = useState<any>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const [desiredIncome, setDesiredIncome] = useState(75000);
  const [workWeeks, setWorkWeeks] = useState(50);
  const [billableHours, setBillableHours] = useState(30);
  const [businessExpenses, setBusinessExpenses] = useState(12000);
  const [taxRate, setTaxRate] = useState(30);
  const [profitMargin, setProfitMargin] = useState(20);
  const [projectHours, setProjectHours] = useState(40);
  const [complexityMultiplier, setComplexityMultiplier] = useState(1.2);
  const [selectedBenchmark, setSelectedBenchmark] = useState<any>(null);

  const [results, setResults] = useState<any>(null);

  const benchmarks = [
    { name: 'Web Dev', field: 'Web Development', min: 50, max: 150 },
    { name: 'Design', field: 'Graphic Design', min: 35, max: 100 },
    { name: 'Writing', field: 'Content Writing', min: 25, max: 75 },
    { name: 'Marketing', field: 'Marketing', min: 40, max: 120 },
    { name: 'Consulting', field: 'Consulting', min: 75, max: 300 },
    { name: 'Data Analytics', field: 'Data Analysis', min: 60, max: 180 }
  ];

  const calculateRates = () => {
    const totalBillableHours = workWeeks * billableHours;
    const grossIncomeNeeded = desiredIncome + businessExpenses;
    const preTaxIncome = grossIncomeNeeded / (1 - taxRate / 100);
    const minimumRate = preTaxIncome / totalBillableHours;
    const targetRate = minimumRate * (1 + profitMargin / 100);
    const projectRate = targetRate * projectHours * complexityMultiplier;
    const monthlyRevenue = (targetRate * totalBillableHours) / 12;
    const annualGrossRevenue = targetRate * totalBillableHours;
    const taxes = (annualGrossRevenue - businessExpenses) * (taxRate / 100);
    const netIncome = annualGrossRevenue - businessExpenses - taxes;

    let comparison = 'Competitive';
    let details = 'Select an industry benchmark';

    if (selectedBenchmark) {
      const { min, max, field } = selectedBenchmark;
      details = `Within ${field} range ($${min}-$${max}/hr)`;

      if (targetRate < min) {
        comparison = 'Below Market';
        details = `Below ${field} range - consider increasing`;
      } else if (targetRate > max) {
        comparison = 'Premium Rate';
        details = `Above ${field} range - justify with expertise`;
      }
    }

    setResults({
      minimumRate,
      targetRate,
      projectRate,
      monthlyRevenue,
      netIncome,
      annualGrossRevenue,
      taxes,
      comparison,
      details
    });
  };

  const updateCharts = () => {
    if (!chartLoaded || !results) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    setTimeout(() => {
      if (rateChartRef.current) {
        const ctx = rateChartRef.current.getContext('2d');
        if (ctx) {
          if (rateChartInstance) rateChartInstance.destroy();

          const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Desired Income', 'Business Expenses', 'Taxes', 'Profit'],
              datasets: [{
                data: [desiredIncome, businessExpenses, results.taxes, results.netIncome - desiredIncome],
                backgroundColor: ['#3B82F6', '#F97316', '#EF4444', '#10B981']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'Rate Components' }
              }
            }
          });

          setRateChartInstance(newChart);
        }
      }

      if (incomeChartRef.current) {
        const ctx = incomeChartRef.current.getContext('2d');
        if (ctx) {
          if (incomeChartInstance) incomeChartInstance.destroy();

          const newChart = new Chart(ctx, {
            type: 'bar',
            data: {
              labels: ['Gross Revenue', 'After Expenses', 'After Taxes', 'Net Income'],
              datasets: [{
                label: 'Amount ($)',
                data: [
                  results.annualGrossRevenue,
                  results.annualGrossRevenue - businessExpenses,
                  results.netIncome + (results.netIncome - desiredIncome),
                  results.netIncome
                ],
                backgroundColor: ['#3B82F6', '#F97316', '#EF4444', '#10B981']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: true, text: 'Annual Income Breakdown' }
              },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Amount ($)' } }
              }
            }
          });

          setIncomeChartInstance(newChart);
        }
      }
    }, 100);
  };

  useEffect(() => {
    calculateRates();
  }, [desiredIncome, workWeeks, billableHours, businessExpenses, taxRate, profitMargin, projectHours, complexityMultiplier, selectedBenchmark]);

  useEffect(() => {
    if (chartLoaded && results) {
      updateCharts();
    }

    return () => {
      if (rateChartInstance) rateChartInstance.destroy();
      if (incomeChartInstance) incomeChartInstance.destroy();
    };
  }, [results, chartLoaded]);

  const formatCurrency = (value: number) => `$${Math.round(value).toLocaleString()}`;

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload"
        onLoad={() => setChartLoaded(true)}
      />

      <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Freelance Rate Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600">
            Calculate your optimal freelance rates based on income goals, expenses, and market benchmarks.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rate Calculation</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Desired Annual Income ($)</label>
                  <input
                    type="number"
                    value={desiredIncome}
                    onChange={(e) => setDesiredIncome(Number(e.target.value))}
                    step="1000"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Work Weeks per Year</label>
                  <input
                    type="number"
                    value={workWeeks}
                    onChange={(e) => setWorkWeeks(Number(e.target.value))}
                    min="1"
                    max="52"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Billable Hours per Week</label>
                  <input
                    type="number"
                    value={billableHours}
                    onChange={(e) => setBillableHours(Number(e.target.value))}
                    min="1"
                    max="60"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Business Expenses (Annual) ($)</label>
                  <input
                    type="number"
                    value={businessExpenses}
                    onChange={(e) => setBusinessExpenses(Number(e.target.value))}
                    step="500"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (%)</label>
                  <input
                    type="number"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    min="0"
                    max="50"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profit Margin (%)</label>
                  <input
                    type="number"
                    value={profitMargin}
                    onChange={(e) => setProfitMargin(Number(e.target.value))}
                    min="0"
                    max="50"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Hours (for project pricing)</label>
                  <input
                    type="number"
                    value={projectHours}
                    onChange={(e) => setProjectHours(Number(e.target.value))}
                    min="1"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Complexity</label>
                  <select
                    value={complexityMultiplier}
                    onChange={(e) => setComplexityMultiplier(Number(e.target.value))}
                    className="w-full px-2 py-2 border rounded-lg"
                  >
                    <option value="1.0">Simple/Routine</option>
                    <option value="1.2">Medium Complexity</option>
                    <option value="1.5">Complex/Specialized</option>
                    <option value="1.8">High Risk/Innovation</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Rate Analysis</h2>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700">Minimum Hourly Rate</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">${Math.round(results.minimumRate)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-blue-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Target Rate</div>
                      <div className="text-lg font-bold text-blue-600">${Math.round(results.targetRate)}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Project Rate</div>
                      <div className="text-lg font-bold text-purple-600">{formatCurrency(results.projectRate)}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Monthly Revenue</div>
                      <div className="text-lg font-bold text-orange-600">{formatCurrency(results.monthlyRevenue)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Annual Net Income</div>
                      <div className="text-lg font-bold">{formatCurrency(results.netIncome)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Rate Breakdown</h3>
                    <canvas ref={rateChartRef} style={{ maxHeight: '250px' }}></canvas>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Income Projection</h3>
                    <canvas ref={incomeChartRef} style={{ maxHeight: '250px' }}></canvas>
                  </div>
                </div>
              </div>
            )}
          </div>

          {results && (
            <div className="mt-6">
              <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 Freelance Pricing Tips</h3>
                <p className="text-xs text-blue-800">Your hourly rate should cover your desired income, business expenses, taxes, and profit margin. Don't forget to account for non-billable time like admin work, marketing, and client acquisition. Consider value-based pricing for specialized projects.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Industry Benchmarks</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {benchmarks.map((benchmark, index) => (
                      <button
                        key={index}
                        type="button"
                        onClick={() => setSelectedBenchmark(benchmark)}
                        className={`p-3 text-sm border rounded-lg hover:bg-blue-50 transition-colors ${
                          selectedBenchmark?.field === benchmark.field ? 'border-blue-500 bg-blue-50' : ''
                        }`}
                      >
                        <div className="font-semibold">{benchmark.name}</div>
                        <div className="text-xs text-gray-500">${benchmark.min}-{benchmark.max}/hr</div>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Rate Comparison</h3>
                  <div className="space-y-3">
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="text-sm text-gray-600">Your Rate vs Market</div>
                      <div className="text-2xl font-bold text-blue-600">{results.comparison}</div>
                      <p className="text-xs text-gray-500 mt-1">{results.details}</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="text-sm text-gray-600">Effective Hourly Rate</div>
                      <div className="text-2xl font-bold text-green-600">${Math.round(results.targetRate)}/hr</div>
                      <p className="text-xs text-gray-500 mt-1">Including all factors</p>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-4 border">
                      <div className="text-sm text-gray-600">Break-even Rate</div>
                      <div className="text-2xl font-bold text-orange-600">${Math.round(results.minimumRate)}/hr</div>
                      <p className="text-xs text-gray-500 mt-1">Minimum to cover costs</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Formula Section */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">Freelance Rate Calculation Formula</h3>
            <p className="text-blue-800 mb-4">Calculate your freelance rate using this comprehensive formula:</p>
            <div className="bg-white rounded-lg p-4">
              <p className="font-mono text-sm mb-2">Hourly Rate = (Desired Income + Expenses + Taxes + Profit) ÷ Billable Hours</p>
              <p className="font-mono text-sm mb-2">Project Rate = Hourly Rate × Project Hours × Complexity Multiplier</p>
              <p className="text-sm text-gray-600 mt-2">Where:</p>
              <ul className="text-sm text-gray-600 list-none mt-2 space-y-1">
                <li>Desired Income = Your target annual salary</li>
                <li>Expenses = Business costs (equipment, software, marketing)</li>
                <li>Taxes = Self-employment and income taxes</li>
                <li>Billable Hours = Working weeks × hours per week</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="freelance-rate-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
