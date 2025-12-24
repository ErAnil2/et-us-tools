'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Script from 'next/script';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Epfo Calculator?",
    answer: "A Epfo Calculator is a free online tool designed to help you quickly and accurately calculate epfo-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Epfo Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Epfo Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Epfo Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function EpfoCalculatorClient() {
  const epfoChartRef = useRef<HTMLCanvasElement>(null);
  const growthChartRef = useRef<HTMLCanvasElement>(null);
  const [epfoChartInstance, setEpfoChartInstance] = useState<any>(null);
  const [growthChartInstance, setGrowthChartInstance] = useState<any>(null);
  const [chartLoaded, setChartLoaded] = useState(false);

  const [basicSalary, setBasicSalary] = useState(30000);
  const [epfRate, setEpfRate] = useState(12);
  const [epsRate] = useState(8.33);
  const [currentAge, setCurrentAge] = useState(30);
  const [retirementAge] = useState(58);
  const [interestRate] = useState(8.25);

  const [results, setResults] = useState<any>(null);

  const templates = [
    { name: 'Entry Level', salary: 25000, age: 25, color: 'blue' },
    { name: 'Mid Career', salary: 40000, age: 30, color: 'green' },
    { name: 'Senior Level', salary: 60000, age: 35, color: 'purple' },
    { name: 'High Earner', salary: 80000, age: 28, color: 'orange' },
    { name: 'Late Starter', salary: 50000, age: 40, color: 'red' },
    { name: 'Executive', salary: 100000, age: 32, color: 'emerald' }
  ];

  const calculateEPF = () => {
    const epfContribution = (basicSalary * epfRate) / 100;
    const epsContribution = Math.min((basicSalary * epsRate) / 100, 1250);
    const employerEpfContribution = epfContribution - epsContribution;
    const totalMonthlyContribution = epfContribution + employerEpfContribution;

    const investmentYears = retirementAge - currentAge;
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = investmentYears * 12;

    const maturityAmount = totalMonthlyContribution *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);

    const totalInvestment = totalMonthlyContribution * totalMonths;
    const totalReturns = maturityAmount - totalInvestment;

    const pensionableService = Math.min(investmentYears, 35);
    const pensionableSalary = Math.min(basicSalary, 15000);
    const monthlyPension = (pensionableSalary * pensionableService) / 70;

    const yearData = [];
    const labels = [];

    for (let year = 1; year <= investmentYears; year++) {
      const months = year * 12;
      const yearValue = totalMonthlyContribution *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
      yearData.push(Math.round(yearValue));
      labels.push(`Year ${year}`);
    }

    setResults({
      maturityAmount,
      totalInvestment,
      totalReturns,
      monthlyPension,
      totalMonthlyContribution,
      epfContribution,
      employerEpfContribution,
      epsContribution,
      yearData,
      labels,
      totalMonths
    });
  };

  const updateCharts = () => {
    if (!chartLoaded || !results) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    setTimeout(() => {
      if (epfoChartRef.current) {
        const ctx = epfoChartRef.current.getContext('2d');
        if (ctx) {
          if (epfoChartInstance) epfoChartInstance.destroy();

          const newChart = new Chart(ctx, {
            type: 'doughnut',
            data: {
              labels: ['Total Investment', 'Interest Earned', 'EPS Contribution'],
              datasets: [{
                data: [results.totalInvestment, results.totalReturns, results.epsContribution * results.totalMonths],
                backgroundColor: ['#3B82F6', '#10B981', '#F59E0B']
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { position: 'bottom' },
                title: { display: true, text: 'EPFO Breakdown' }
              }
            }
          });

          setEpfoChartInstance(newChart);
        }
      }

      if (growthChartRef.current) {
        const ctx = growthChartRef.current.getContext('2d');
        if (ctx) {
          if (growthChartInstance) growthChartInstance.destroy();

          const newChart = new Chart(ctx, {
            type: 'line',
            data: {
              labels: results.labels,
              datasets: [{
                label: 'EPF Value (₹)',
                data: results.yearData,
                borderColor: '#3B82F6',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                fill: true,
                tension: 0.4
              }]
            },
            options: {
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: true },
                title: { display: true, text: 'EPF Growth Over Time' }
              },
              scales: {
                y: { beginAtZero: true, title: { display: true, text: 'Value (₹)' } }
              }
            }
          });

          setGrowthChartInstance(newChart);
        }
      }
    }, 100);
  };

  useEffect(() => {
    calculateEPF();
  }, [basicSalary, epfRate, currentAge]);

  useEffect(() => {
    if (chartLoaded && results) {
      updateCharts();
    }

    return () => {
      if (epfoChartInstance) epfoChartInstance.destroy();
      if (growthChartInstance) growthChartInstance.destroy();
    };
  }, [results, chartLoaded]);

  const formatCurrency = (value: number) => `₹${Math.round(value).toLocaleString('en-IN')}`;

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
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">EPFO Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600">Calculate your Employee Provident Fund returns and retirement corpus with detailed projections</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">EPFO Details</h2>
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Basic Salary + DA (₹/month)</label>
                  <input
                    type="number"
                    value={basicSalary}
                    onChange={(e) => setBasicSalary(Number(e.target.value))}
                    min="1000"
                    step="1000"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Employee EPF Rate (%)</label>
                  <input
                    type="number"
                    value={epfRate}
                    onChange={(e) => setEpfRate(Number(e.target.value))}
                    min="12"
                    max="100"
                    step="0.01"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 12% of Basic Salary + DA</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">EPS Rate (%)</label>
                  <input
                    type="number"
                    value={epsRate}
                    readOnly
                    className="w-full px-2 py-2 border rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fixed at 8.33% (capped at ₹15,000 p.a.)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Age (Years)</label>
                  <input
                    type="number"
                    value={currentAge}
                    onChange={(e) => setCurrentAge(Number(e.target.value))}
                    min="18"
                    max="57"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Retirement Age (Years)</label>
                  <input
                    type="number"
                    value={retirementAge}
                    readOnly
                    className="w-full px-2 py-2 border rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fixed at 58 years</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% p.a)</label>
                  <input
                    type="number"
                    value={interestRate}
                    readOnly
                    className="w-full px-2 py-2 border rounded-lg bg-gray-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">Current EPF interest rate for FY 2024-25</p>
                </div>
              </div>

              {/* Quick EPFO Scenarios */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Quick EPFO Scenarios</h3>
                <div className="grid grid-cols-2 gap-2">
                  {templates.map((template, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setBasicSalary(template.salary);
                        setCurrentAge(template.age);
                      }}
                      className={`p-2 bg-${template.color}-100 hover:bg-${template.color}-200 text-${template.color}-800 rounded-lg text-center transition-colors`}
                    >
                      <div className="font-medium text-xs">{template.name}</div>
                      <div className="text-xs">₹{(template.salary / 1000)}K, Age {template.age}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">EPFO Returns</h2>
                <div className="space-y-3">
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="text-sm text-green-700">EPF Corpus at Retirement</div>
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(results.maturityAmount)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Total Investment</div>
                      <div className="text-lg font-bold">{formatCurrency(results.totalInvestment)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Interest Earned</div>
                      <div className="text-lg font-bold text-green-600">{formatCurrency(results.totalReturns)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Monthly Pension</div>
                      <div className="text-lg font-bold">{formatCurrency(results.monthlyPension)}</div>
                    </div>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="text-xs text-gray-600">Total Monthly Contribution</div>
                      <div className="text-lg font-bold">{formatCurrency(results.totalMonthlyContribution)}</div>
                    </div>
                  </div>

                  <div className="mt-4">
                    <canvas ref={epfoChartRef} style={{ maxHeight: '250px' }}></canvas>
                  </div>
                </div>
              </div>
            )}
          </div>

          {results && (
            <div className="mt-6">
              <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-sm font-semibold text-blue-900 mb-2">💡 EPFO Benefits</h3>
                <p className="text-xs text-blue-800">EPFO provides guaranteed returns with tax benefits under EEE status. Both employee and employer contributions are matched, making it one of the best retirement savings schemes with additional pension benefits through EPS.</p>
              </div>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Monthly Contributions</h3>
                  <div className="overflow-x-auto border rounded-lg">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-2 py-2 text-left border">Contribution Type</th>
                          <th className="px-2 py-2 text-right border">Amount (₹)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="bg-white">
                          <td className="px-2 py-2 border">Employee EPF</td>
                          <td className="px-2 py-2 text-right border">{Math.round(results.epfContribution).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="px-2 py-2 border">Employer EPF</td>
                          <td className="px-2 py-2 text-right border">{Math.round(results.employerEpfContribution).toLocaleString('en-IN')}</td>
                        </tr>
                        <tr className="bg-white">
                          <td className="px-2 py-2 border">Employer EPS</td>
                          <td className="px-2 py-2 text-right border">{Math.round(results.epsContribution).toLocaleString('en-IN')}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Growth Projection</h3>
                  <canvas ref={growthChartRef} style={{ maxHeight: '240px' }}></canvas>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Information Section */}
        <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
            <h3 className="text-xl font-semibold text-blue-900 mb-4">EPF Components</h3>
            <p className="text-blue-800 mb-4">Employee Provident Fund consists of:</p>
            <div className="bg-white rounded-lg p-4">
              <ul className="text-sm text-gray-600 list-none mt-2 space-y-2">
                <li>1. Employee Contribution (12% of Basic + DA)</li>
                <li>2. Employer EPF Contribution (3.67% of Basic + DA)</li>
                <li>3. Employer EPS Contribution (8.33% of Basic + DA, capped)</li>
                <li>4. Interest earned on accumulated balance</li>
              </ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-blue-900 mb-3">Tax Benefits</h4>
              <p className="text-blue-800">Contributions and returns are tax-free</p>
            </div>

            <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-green-900 mb-3">Employer Match</h4>
              <p className="text-green-800">Equal contribution from employer</p>
            </div>

            <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
              <h4 className="text-lg font-semibold text-purple-900 mb-3">Pension Benefit</h4>
              <p className="text-purple-800">Additional pension through EPS</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="epfo-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </>
  );
}
