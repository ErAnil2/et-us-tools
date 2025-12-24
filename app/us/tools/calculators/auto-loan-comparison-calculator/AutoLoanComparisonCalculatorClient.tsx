'use client';

import { useState, useEffect, useRef } from 'react';
import Script from 'next/script';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Auto Loan Comparison Calculator?",
    answer: "A Auto Loan Comparison Calculator is a free online tool that helps you calculate and analyze auto loan comparison-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Auto Loan Comparison Calculator?",
    answer: "Our Auto Loan Comparison Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Auto Loan Comparison Calculator free to use?",
    answer: "Yes, this Auto Loan Comparison Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Auto Loan Comparison calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to auto loan comparison such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function AutoLoanComparisonCalculatorClient() {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const [chartInstance, setChartInstance] = useState<any>(null);
  const [showingFullSchedule, setShowingFullSchedule] = useState(true);
  const [chartLoaded, setChartLoaded] = useState(false);

  // Input states for Option 1
  const [compare1Amount, setCompare1Amount] = useState(20000);
  const [compare1Rate, setCompare1Rate] = useState(5.5);
  const [compare1Term, setCompare1Term] = useState(36);

  // Input states for Option 2
  const [compare2Amount, setCompare2Amount] = useState(20000);
  const [compare2Rate, setCompare2Rate] = useState(6.5);
  const [compare2Term, setCompare2Term] = useState(60);

  // Input states for Option 3
  const [compare3Amount, setCompare3Amount] = useState(20000);
  const [compare3Rate, setCompare3Rate] = useState(7.5);
  const [compare3Term, setCompare3Term] = useState(72);

  const [results, setResults] = useState<any>(null);

  const calculateMonthlyPayment = (principal: number, annualRate: number, months: number) => {
    const monthlyRate = annualRate / 100 / 12;
    if (monthlyRate === 0) return principal / months;

    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, months)) /
                   (Math.pow(1 + monthlyRate, months) - 1);
    return payment;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const generatePaymentSchedule = (principal: number, annualRate: number, months: number) => {
    const schedule = [];
    const monthlyRate = annualRate / 100 / 12;
    const monthlyPayment = calculateMonthlyPayment(principal, annualRate, months);
    let balance = principal;

    for (let i = 1; i <= months; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = monthlyPayment - interestPayment;
      balance -= principalPayment;

      schedule.push({
        payment: i,
        principal: principalPayment,
        interest: interestPayment,
        balance: Math.max(0, balance)
      });
    }

    return schedule;
  };

  const compareLoans = () => {
    const inputs = [
      { amount: compare1Amount, rate: compare1Rate, term: compare1Term },
      { amount: compare2Amount, rate: compare2Rate, term: compare2Term },
      { amount: compare3Amount, rate: compare3Rate, term: compare3Term }
    ];

    const options = inputs.map((input, i) => {
      const monthlyPayment = calculateMonthlyPayment(input.amount, input.rate, input.term);
      const totalPaid = monthlyPayment * input.term;
      const totalInterest = totalPaid - input.amount;

      return {
        name: `Option ${i + 1}`,
        amount: input.amount,
        rate: input.rate,
        term: input.term,
        monthlyPayment,
        totalPaid,
        totalInterest,
        schedule: generatePaymentSchedule(input.amount, input.rate, input.term)
      };
    });

    const bestOption = options.reduce((best, current) =>
      current.totalInterest < best.totalInterest ? current : best
    );

    const savings = Math.max(...options.map(o => o.totalInterest)) - bestOption.totalInterest;

    setResults({
      options,
      bestOption,
      savings
    });
  };

  const updateChart = () => {
    if (!chartLoaded || !chartRef.current || !results) return;

    const Chart = (window as any).Chart;
    if (!Chart) return;

    if (chartInstance) {
      chartInstance.destroy();
    }

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    const newChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Monthly Payment', 'Total Interest', 'Total Cost'],
        datasets: [
          {
            label: 'Option 1 (Short Term)',
            data: [results.options[0].monthlyPayment, results.options[0].totalInterest, results.options[0].totalPaid],
            backgroundColor: '#3B82F6',
            borderColor: '#1D4ED8',
            borderWidth: 2
          },
          {
            label: 'Option 2 (Medium Term)',
            data: [results.options[1].monthlyPayment, results.options[1].totalInterest, results.options[1].totalPaid],
            backgroundColor: '#10B981',
            borderColor: '#059669',
            borderWidth: 2
          },
          {
            label: 'Option 3 (Long Term)',
            data: [results.options[2].monthlyPayment, results.options[2].totalInterest, results.options[2].totalPaid],
            backgroundColor: '#F59E0B',
            borderColor: '#D97706',
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value: any) {
                return '$' + value.toLocaleString();
              }
            }
          }
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: function(context: any) {
                return context.dataset.label + ': $' + context.raw.toLocaleString();
              }
            }
          }
        }
      }
    });

    setChartInstance(newChart);
  };

  const exportSchedules = () => {
    if (!results) return;

    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Option,Payment #,Principal,Interest,Balance\n";

    results.options.forEach((option: any) => {
      option.schedule.forEach((payment: any) => {
        csvContent += `${option.name},${payment.payment},${payment.principal.toFixed(2)},${payment.interest.toFixed(2)},${payment.balance.toFixed(2)}\n`;
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "auto_loan_comparison_schedules.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate on mount and when inputs change
  useEffect(() => {
    compareLoans();
  }, [compare1Amount, compare1Rate, compare1Term, compare2Amount, compare2Rate, compare2Term, compare3Amount, compare3Rate, compare3Term]);

  // Update chart when results or chartLoaded changes
  useEffect(() => {
    if (chartLoaded && results) {
      updateChart();
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [results, chartLoaded]);

  const relatedFinanceCalculators = [
    { href: "/us/tools/calculators/auto-loan-calculator", title: "Auto Loan Calculator", description: "Calculate car payments", color: "bg-blue-600" },
    { href: "/us/tools/calculators/auto-loan-affordability-calculator", title: "Auto Loan Affordability", description: "Check affordability", color: "bg-green-600" },
    { href: "/us/tools/calculators/loan-calculator", title: "Loan Calculator", description: "General loan calculations", color: "bg-purple-600" },
    { href: "/us/tools/calculators/mortgage-payment-calculator", title: "Mortgage Calculator", description: "Home loan calculations", color: "bg-orange-600" },
    { href: "/us/tools/calculators/compound-interest-calculator", title: "Compound Interest Calculator", description: "Calculate compound interest", color: "bg-emerald-500" },
    { href: "/us/tools/calculators/roi-calculator", title: "ROI Calculator", description: "Return on investment", color: "bg-pink-500" }
  ];

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        strategy="lazyOnload"
        onLoad={() => setChartLoaded(true)}
      />

      <div className="max-w-[1180px] mx-auto p-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Auto Loan Comparison Calculator</h1>
          <p className="text-lg text-gray-600">Compare multiple car loan options to find the best financing deal</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Compare Loan Options</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {/* Option 1 */}
            <div className="border-2 border-blue-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-center mb-4 text-blue-600">Option 1: Short Term</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={compare1Amount}
                    onChange={(e) => setCompare1Amount(Number(e.target.value))}
                    step="1000"
                    placeholder="Enter loan amount"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={compare1Rate}
                    onChange={(e) => setCompare1Rate(Number(e.target.value))}
                    step="0.1"
                    placeholder="Enter interest rate"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term (months)</label>
                  <select
                    value={compare1Term}
                    onChange={(e) => setCompare1Term(Number(e.target.value))}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="24">24 months</option>
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Option 2 */}
            <div className="border-2 border-green-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-center mb-4 text-green-600">Option 2: Medium Term</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={compare2Amount}
                    onChange={(e) => setCompare2Amount(Number(e.target.value))}
                    step="1000"
                    placeholder="Enter loan amount"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={compare2Rate}
                    onChange={(e) => setCompare2Rate(Number(e.target.value))}
                    step="0.1"
                    placeholder="Enter interest rate"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term (months)</label>
                  <select
                    value={compare2Term}
                    onChange={(e) => setCompare2Term(Number(e.target.value))}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="36">36 months</option>
                    <option value="48">48 months</option>
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Option 3 */}
            <div className="border-2 border-orange-200 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-center mb-4 text-orange-600">Option 3: Long Term</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Amount ($)</label>
                  <input
                    type="number"
                    value={compare3Amount}
                    onChange={(e) => setCompare3Amount(Number(e.target.value))}
                    step="1000"
                    placeholder="Enter loan amount"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (%)</label>
                  <input
                    type="number"
                    value={compare3Rate}
                    onChange={(e) => setCompare3Rate(Number(e.target.value))}
                    step="0.1"
                    placeholder="Enter interest rate"
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Term (months)</label>
                  <select
                    value={compare3Term}
                    onChange={(e) => setCompare3Term(Number(e.target.value))}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    <option value="60">60 months</option>
                    <option value="72">72 months</option>
                    <option value="84">84 months</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section */}
        {results && (
          <>
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Comparison Results</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {results.options.map((option: any, index: number) => {
                  const colors = ['blue', 'green', 'orange'];
                  const color = colors[index];
                  return (
                    <div key={index} className={`border-2 border-${color}-500 rounded-lg p-6`}>
                      <h4 className={`text-lg font-semibold text-center mb-4 text-${color}-600`}>
                        {option.name}: {index === 0 ? 'Short' : index === 1 ? 'Medium' : 'Long'} Term
                      </h4>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span>Loan Amount:</span>
                          <span className="font-medium">{formatCurrency(option.amount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Interest Rate:</span>
                          <span className="font-medium">{option.rate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Term:</span>
                          <span className="font-medium">{option.term} months</span>
                        </div>
                        <div className="border-t pt-3">
                          <div className="flex justify-between font-semibold text-lg">
                            <span>Monthly Payment:</span>
                            <span className={`text-${color}-600`}>{formatCurrency(option.monthlyPayment)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Interest:</span>
                            <span>{formatCurrency(option.totalInterest)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Cost:</span>
                            <span>{formatCurrency(option.totalPaid)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Comparison Chart */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Payment Comparison</h4>
                <div className="relative h-80">
                  <canvas ref={chartRef}></canvas>
                </div>
              </div>

              {/* Best Option Recommendation */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <h4 className="font-semibold text-green-800 mb-2">Best Value Recommendation</h4>
                <p className="text-green-700">
                  {results.bestOption.name} saves you {formatCurrency(results.savings)} compared to the most expensive option with the lowest total interest cost.
                </p>
              </div>
            </div>

            {/* Detailed Calculation Breakdown */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Detailed Calculation Breakdown</h3>
              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {results.options.map((option: any, index: number) => {
                  const colors = ['blue', 'green', 'orange'];
                  const color = colors[index];
                  const monthlyRate = option.rate / 100 / 12;
                  return (
                    <div key={index} className="border rounded-lg p-6">
                      <h4 className={`text-lg font-semibold text-${color}-600 mb-4 text-center`}>Option {index + 1} Details</h4>
                      <div className="space-y-3 text-sm">
                        <div className={`bg-${color}-50 rounded p-3`}>
                          <h5 className={`font-semibold text-${color}-800 mb-2`}>Calculation Formula:</h5>
                          <p className={`text-${color}-700`}>M = P × [r(1+r)^n] / [(1+r)^n - 1]</p>
                          <p className={`text-xs text-${color}-600 mt-1`}>Where: M = Monthly Payment, P = Principal, r = Monthly Interest Rate, n = Number of Payments</p>
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <span>Principal (P):</span>
                            <span className="font-medium">{formatCurrency(option.amount)}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Monthly Rate (r):</span>
                            <span className="font-medium">{(monthlyRate * 100).toFixed(3)}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Number of Payments (n):</span>
                            <span className="font-medium">{option.term}</span>
                          </div>
                          <div className="flex justify-between border-t pt-2">
                            <span className="font-semibold">Monthly Payment:</span>
                            <span className={`font-semibold text-${color}-600`}>{formatCurrency(option.monthlyPayment)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Payment Schedules */}
            <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-semibold text-gray-800">Payment Schedules</h3>
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowingFullSchedule(!showingFullSchedule)}
                    className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    {showingFullSchedule ? 'Show First Year Only' : 'Show Full Schedule'}
                  </button>
                  <button
                    onClick={exportSchedules}
                    className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                  >
                    Export All Schedules
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {results.options.map((option: any, index: number) => {
                  const colors = ['blue', 'green', 'orange'];
                  const color = colors[index];
                  const displaySchedule = showingFullSchedule ? option.schedule : option.schedule.slice(0, 12);
                  return (
                    <div key={index} className="border rounded-lg p-4">
                      <h4 className={`text-lg font-semibold text-${color}-600 mb-4 text-center`}>Option {index + 1} Schedule</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                          <thead>
                            <tr className={`bg-${color}-50`}>
                              <th className="px-2 py-1 text-left">Payment</th>
                              <th className="px-2 py-1 text-right">Principal</th>
                              <th className="px-2 py-1 text-right">Interest</th>
                              <th className="px-2 py-1 text-right">Balance</th>
                            </tr>
                          </thead>
                          <tbody>
                            {displaySchedule.map((payment: any) => (
                              <tr key={payment.payment}>
                                <td className="px-2 py-1">{payment.payment}</td>
                                <td className="px-2 py-1 text-right">${payment.principal.toFixed(0)}</td>
                                <td className="px-2 py-1 text-right">${payment.interest.toFixed(0)}</td>
                                <td className="px-2 py-1 text-right">${payment.balance.toFixed(0)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Related Auto Loan Calculators</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {relatedFinanceCalculators.map((calc, index) => (
              <a
                key={index}
                href={calc.href}
                className="group bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 p-4 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <span className="text-xl">🚗</span>
                </div>
                <h4 className="font-semibold text-sm text-gray-800 mb-1 group-hover:text-blue-600">{calc.title}</h4>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </a>
            ))}
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Why Compare Auto Loan Options Before Buying?</h2>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6 leading-relaxed">
              One of the most overlooked aspects of car buying is the financing. Many buyers focus solely on negotiating the car price while accepting whatever loan terms the dealer offers. This mistake can cost thousands of dollars over the life of your loan. Using an auto loan comparison calculator before stepping into a dealership puts you in control of your financing and helps you make informed decisions.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">The True Cost of Loan Terms</h3>
            <p className="text-gray-600 mb-4 leading-relaxed">
              The difference between a 36-month and 72-month loan on the same vehicle can be staggering. While the longer term offers lower monthly payments, you'll pay significantly more in total interest. Consider this example:
            </p>

            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <h4 className="font-semibold text-gray-800 mb-3">Example: $25,000 Loan at 6% APR</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <h5 className="font-semibold text-blue-800 mb-2">36 Months</h5>
                  <p className="text-sm text-blue-700">Monthly: $760</p>
                  <p className="text-sm text-blue-700">Total Interest: $2,368</p>
                  <p className="text-sm font-semibold text-blue-900">Total Cost: $27,368</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                  <h5 className="font-semibold text-green-800 mb-2">60 Months</h5>
                  <p className="text-sm text-green-700">Monthly: $483</p>
                  <p className="text-sm text-green-700">Total Interest: $3,999</p>
                  <p className="text-sm font-semibold text-green-900">Total Cost: $28,999</p>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                  <h5 className="font-semibold text-orange-800 mb-2">72 Months</h5>
                  <p className="text-sm text-orange-700">Monthly: $414</p>
                  <p className="text-sm text-orange-700">Total Interest: $4,828</p>
                  <p className="text-sm font-semibold text-orange-900">Total Cost: $29,828</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 mt-4">The 72-month loan costs $2,460 more than the 36-month option—that's nearly 10% extra!</p>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Factors to Compare</h3>
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-blue-500">📊</span> Interest Rate (APR)
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Even a 0.5% difference in APR can save hundreds over the loan term. Always compare rates from multiple sources: banks, credit unions, online lenders, and the dealership. Your credit score significantly impacts your rate—750+ gets the best offers.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-green-500">📅</span> Loan Term Length
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Shorter terms mean higher payments but massive interest savings. The sweet spot for most buyers is 48-60 months—manageable payments without excessive interest. Avoid 84-month loans unless absolutely necessary.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-purple-500">💵</span> Monthly Payment
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Your car payment should fit comfortably in your budget—ideally under 10-15% of your monthly income. Don't stretch to afford higher payments that might strain your finances during emergencies.
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span className="text-orange-500">📈</span> Total Cost
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  The total cost (principal + interest) reveals the true price of your car. A low monthly payment on a long-term loan might seem attractive, but the total cost tells the real story.
                </p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Where to Get Auto Loan Quotes</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Credit Unions:</strong> Often offer the lowest rates, especially for members. Average 1-2% lower than banks.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Online Lenders:</strong> Convenient pre-approval process. Companies like Capital One, LightStream offer competitive rates.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Banks:</strong> Your existing bank may offer rate discounts for customers. Worth checking first.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Dealerships:</strong> Sometimes offer 0% promotions, but may inflate car price. Always compare.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Pro Tips for Getting the Best Auto Loan</h3>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-100 mb-6">
              <ul className="text-blue-800 space-y-2">
                <li className="flex items-start gap-2"><span className="font-bold">1.</span>Get pre-approved before visiting dealerships—this gives you negotiating leverage.</li>
                <li className="flex items-start gap-2"><span className="font-bold">2.</span>Apply to multiple lenders within a 14-day window—credit bureaus treat it as a single inquiry.</li>
                <li className="flex items-start gap-2"><span className="font-bold">3.</span>Negotiate the car price and financing separately—don't let dealers bundle them.</li>
                <li className="flex items-start gap-2"><span className="font-bold">4.</span>Read the fine print for prepayment penalties—you want flexibility to pay off early.</li>
                <li className="flex items-start gap-2"><span className="font-bold">5.</span>Consider refinancing in 6-12 months if rates drop or your credit improves.</li>
              </ul>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">New Car vs. Used Car Loan Differences</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h4 className="font-semibold text-blue-900 mb-2">New Car Loans</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Lower interest rates (often 0-4%)</li>
                  <li>• Longer terms available (up to 84 months)</li>
                  <li>• Manufacturer incentives and rebates</li>
                  <li>• Higher loan amounts approved</li>
                </ul>
              </div>
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h4 className="font-semibold text-green-900 mb-2">Used Car Loans</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Higher interest rates (typically 4-10%)</li>
                  <li>• Shorter terms (usually max 60-72 months)</li>
                  <li>• Lower purchase price = less total interest</li>
                  <li>• May require larger down payment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-6 mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">How many auto loan offers should I compare?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Aim for at least 3-5 different loan offers. Include a mix of sources: your bank, a credit union, an online lender, and the dealership. This gives you a solid baseline and ensures you're getting competitive rates. More quotes generally lead to better deals.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Will comparing loans hurt my credit score?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Not if you do it strategically. Credit bureaus recognize rate shopping and treat multiple auto loan inquiries within a 14-45 day window (depending on the scoring model) as a single inquiry. Apply to all your potential lenders within this timeframe to minimize credit impact.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Should I choose the lowest monthly payment or lowest total cost?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                It depends on your financial situation. If cash flow is tight, a manageable monthly payment prevents financial stress. However, if you can afford higher payments, choosing the loan with the lowest total cost saves you money long-term. Run the numbers both ways using this calculator to see the actual dollar difference.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">What's the difference between APR and interest rate?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                The interest rate is the base cost of borrowing money. APR (Annual Percentage Rate) includes the interest rate plus other fees, giving you a more complete picture of the loan's cost. When comparing loans, always use APR for an apples-to-apples comparison.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Is dealer financing ever better than bank financing?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Sometimes yes. Manufacturers occasionally offer 0% APR or very low promotional rates to move inventory. These deals can beat any bank rate. However, verify the deal is genuine—some dealers inflate the car price to compensate for low financing rates. Also check if you'd qualify for manufacturer rebates instead of special financing.
              </p>
            </div>

            <div className="pb-2">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Can I refinance my auto loan later if rates drop?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Yes, auto loan refinancing is common and can save you money if rates decrease or your credit score improves. You can typically refinance after making 6-12 months of payments. Check that your current loan doesn't have prepayment penalties, and ensure the refinance costs don't outweigh the savings.
              </p>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
              <p className="text-sm text-amber-700">
                This calculator provides estimates for comparison purposes only. Actual loan terms, rates, and payments may vary based on your credit profile, the lender, and current market conditions. Always verify terms with the lending institution before making financing decisions.
              </p>
            </div>
          </div>
        
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="auto-loan-comparison-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
      </div>
    </>
  );
}
