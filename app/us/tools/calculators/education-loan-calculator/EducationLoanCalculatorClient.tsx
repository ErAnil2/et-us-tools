'use client';

import { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Script from 'next/script';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface YearlySchedule {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Education Loan Calculator?",
    answer: "A Education Loan Calculator is a free online tool that helps you calculate and analyze education loan-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Education Loan Calculator?",
    answer: "Our Education Loan Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Education Loan Calculator free to use?",
    answer: "Yes, this Education Loan Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Education Loan calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to education loan such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function EducationLoanCalculatorClient() {
  const [loanAmount, setLoanAmount] = useState<number>(50000);
  const [interestRate, setInterestRate] = useState<number>(6.5);
  const [loanTenure, setLoanTenure] = useState<number>(10);
  const [moratoriumPeriod, setMoratoriumPeriod] = useState<number>(4);
  const [expectedSalary, setExpectedSalary] = useState<number>(60000);
  const [loanType, setLoanType] = useState<string>('federal');

  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);
  const [moratoriumInterest, setMoratoriumInterest] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [debtToIncomeRatio, setDebtToIncomeRatio] = useState<number>(0);
  const [affordabilityStatus, setAffordabilityStatus] = useState<string>('Manageable');
  const [affordabilityBarWidth, setAffordabilityBarWidth] = useState<number>(37);
  const [affordabilityBarColor, setAffordabilityBarColor] = useState<string>('bg-green-600');
  const [affordabilityStatusColor, setAffordabilityStatusColor] = useState<string>('text-green-600');
  const [repaymentSchedule, setRepaymentSchedule] = useState<YearlySchedule[]>([]);

  const [chartReady, setChartReady] = useState(false);
  const loanChartRef = useRef<any>(null);
  const paymentChartRef = useRef<any>(null);
  const loanChartInstance = useRef<any>(null);
  const paymentChartInstance = useRef<any>(null);

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  };

  const calculateEducationLoan = () => {
    // Calculate monthly interest rate
    const monthlyRate = interestRate / 12 / 100;
    const totalMonths = loanTenure * 12;
    const moratoriumMonths = moratoriumPeriod * 12;

    // Calculate interest during grace period (capitalized)
    const moratoriumInt = loanAmount * monthlyRate * moratoriumMonths;
    const principalWithCapitalizedInterest = loanAmount + moratoriumInt;

    // Calculate EMI after grace period
    const emi = principalWithCapitalizedInterest * monthlyRate * Math.pow(1 + monthlyRate, totalMonths) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);

    // Calculate totals
    const totalPay = emi * totalMonths;
    const totalInt = totalPay - loanAmount;
    const monthlyIncome = expectedSalary / 12;
    const dti = (emi / monthlyIncome) * 100;

    // Update state
    setMonthlyEMI(emi);
    setMoratoriumInterest(moratoriumInt);
    setTotalInterest(totalInt);
    setTotalPayment(totalPay);
    setDebtToIncomeRatio(dti);

    // Affordability assessment
    if (dti <= 10) {
      setAffordabilityBarWidth(dti * 4);
      setAffordabilityBarColor('bg-green-600');
      setAffordabilityStatus('Excellent');
      setAffordabilityStatusColor('text-green-600');
    } else if (dti <= 15) {
      setAffordabilityBarWidth(Math.min(dti * 3, 100));
      setAffordabilityBarColor('bg-yellow-500');
      setAffordabilityStatus('Manageable');
      setAffordabilityStatusColor('text-yellow-600');
    } else {
      setAffordabilityBarWidth(100);
      setAffordabilityBarColor('bg-red-600');
      setAffordabilityStatus('High Risk');
      setAffordabilityStatusColor('text-red-600');
    }

    // Generate repayment schedule
    generateRepaymentSchedule(principalWithCapitalizedInterest, monthlyRate, totalMonths, emi);

    // Update charts if Chart.js is ready
    if (chartReady && window.Chart) {
      updateCharts(loanAmount, totalInt - moratoriumInt, moratoriumInt);
    }
  };

  const generateRepaymentSchedule = (loanAmt: number, monthlyRate: number, totalMonths: number, emi: number) => {
    let balance = loanAmt;
    const schedule: YearlySchedule[] = [];
    const years = Math.ceil(totalMonths / 12);

    for (let year = 1; year <= years; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;
      let yearPayment = 0;

      for (let month = 1; month <= 12; month++) {
        if ((year - 1) * 12 + month > totalMonths) break;

        const interestPayment = balance * monthlyRate;
        const principalPayment = emi - interestPayment;
        balance -= principalPayment;

        yearPrincipal += principalPayment;
        yearInterest += interestPayment;
        yearPayment += emi;

        if (balance < 0) balance = 0;
      }

      schedule.push({
        year,
        payment: yearPayment,
        principal: yearPrincipal,
        interest: yearInterest,
        balance: Math.max(0, balance)
      });
    }

    setRepaymentSchedule(schedule);
  };

  const updateCharts = (principal: number, interest: number, graceInterest: number) => {
    if (!window.Chart) return;

    // Update loan chart (doughnut)
    if (loanChartRef.current) {
      if (loanChartInstance.current) {
        loanChartInstance.current.destroy();
      }

      const ctx = loanChartRef.current.getContext('2d');
      loanChartInstance.current = new window.Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Principal Amount', 'Interest (Repayment)', 'Interest (Grace Period)'],
          datasets: [{
            data: [principal, interest, graceInterest],
            backgroundColor: ['#3B82F6', '#EF4444', '#F97316'],
            borderWidth: 2,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: 'bottom' },
            title: { display: true, text: 'Loan Composition' }
          }
        }
      });
    }

    // Update payment chart (bar)
    if (paymentChartRef.current) {
      if (paymentChartInstance.current) {
        paymentChartInstance.current.destroy();
      }

      const ctx = paymentChartRef.current.getContext('2d');
      paymentChartInstance.current = new window.Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Original Loan', 'Grace Period Interest', 'Repayment Interest'],
          datasets: [{
            data: [principal, graceInterest, interest],
            backgroundColor: ['#3B82F6', '#F97316', '#EF4444'],
            borderWidth: 1,
            borderColor: '#fff'
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            title: { display: true, text: 'Total Cost Breakdown' }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'Amount ($)' }
            }
          }
        }
      });
    }
  };

  const setEducationTemplate = (amount: number, period: number) => {
    setLoanAmount(amount);
    setMoratoriumPeriod(period);

    // Set appropriate interest rate based on loan amount
    const interestRates: { [key: number]: number } = {
      25000: 4.5,
      50000: 5.5,
      100000: 6.5,
      150000: 7.0,
      200000: 7.5,
      250000: 8.0
    };
    setInterestRate(interestRates[amount] || 6.5);

    // Set expected starting salary based on education level
    const expectedSalaries: { [key: number]: number } = {
      25000: 35000,
      50000: 50000,
      100000: 65000,
      150000: 75000,
      200000: 200000,
      250000: 150000
    };
    setExpectedSalary(expectedSalaries[amount] || 60000);

    // Set appropriate loan type
    if (amount >= 150000) {
      setLoanType('graduate');
    } else {
      setLoanType('federal');
    }
  };

  useEffect(() => {
    calculateEducationLoan();
  }, [loanAmount, interestRate, loanTenure, moratoriumPeriod, expectedSalary, loanType, chartReady]);

  useEffect(() => {
    return () => {
      if (loanChartInstance.current) {
        loanChartInstance.current.destroy();
      }
      if (paymentChartInstance.current) {
        paymentChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/npm/chart.js"
        onLoad={() => setChartReady(true)}
      />
      <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Education Loan Calculator</h1>
          <p className="text-base sm:text-lg text-gray-600">Calculate education loan EMI, student loan payments with moratorium period and amortization schedule</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Calculator Card */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Education Loan Details</h2>

              {/* Education Loan Templates */}
              <div className="mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg font-medium text-gray-700 mb-3">Education Loan Scenarios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(25000, 2)}
                  >
                    Community College ($25K)
                  </button>
                  <button
                    type="button"
                    className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(50000, 4)}
                  >
                    State University ($50K)
                  </button>
                  <button
                    type="button"
                    className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(100000, 4)}
                  >
                    Private University ($100K)
                  </button>
                  <button
                    type="button"
                    className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(150000, 4)}
                  >
                    Graduate School ($150K)
                  </button>
                  <button
                    type="button"
                    className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(200000, 4)}
                  >
                    Medical School ($200K)
                  </button>
                  <button
                    type="button"
                    className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                    onClick={() => setEducationTemplate(250000, 3)}
                  >
                    Law School ($250K)
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Total Loan Amount ($)</label>
                  <input
                    type="number"
                    id="loanAmount"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(parseFloat(e.target.value) || 0)}
                    min="5000"
                    step="5000"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Annual Interest Rate (%)</label>
                  <input
                    type="number"
                    id="interestRate"
                    value={interestRate}
                    onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
                    min="3"
                    max="15"
                    step="0.1"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Repayment Period (Years)</label>
                  <input
                    type="number"
                    id="loanTenure"
                    value={loanTenure}
                    onChange={(e) => setLoanTenure(parseFloat(e.target.value) || 0)}
                    min="5"
                    max="25"
                    step="1"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Grace Period / Moratorium (Years)</label>
                  <input
                    type="number"
                    id="moratoriumPeriod"
                    value={moratoriumPeriod}
                    onChange={(e) => setMoratoriumPeriod(parseFloat(e.target.value) || 0)}
                    min="0"
                    max="8"
                    step="0.5"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Period during studies + 6 months grace period</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Expected Starting Salary ($)</label>
                  <input
                    type="number"
                    id="expectedSalary"
                    value={expectedSalary}
                    onChange={(e) => setExpectedSalary(parseFloat(e.target.value) || 0)}
                    min="25000"
                    step="5000"
                    className="w-full px-2 py-2 border rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1">Annual salary expected after graduation</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Loan Type</label>
                  <select
                    id="loanType"
                    value={loanType}
                    onChange={(e) => setLoanType(e.target.value)}
                    className="w-full px-2 py-2 border rounded-lg"
                  >
                    <option value="federal">Federal Student Loan</option>
                    <option value="private">Private Student Loan</option>
                    <option value="parent">Parent PLUS Loan</option>
                    <option value="graduate">Graduate PLUS Loan</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Results Section */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Loan Payment Analysis</h2>
              <div className="space-y-4">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <div className="text-sm text-green-700">Monthly Payment (After Grace Period)</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(monthlyEMI)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">Interest During Grace</div>
                    <div className="text-lg font-bold text-blue-600">{formatCurrency(moratoriumInterest)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">Total Interest</div>
                    <div className="text-lg font-bold text-red-600">{formatCurrency(totalInterest)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">Total Payment</div>
                    <div className="text-lg font-bold">{formatCurrency(totalPayment)}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3 border">
                    <div className="text-xs text-gray-600">Debt-to-Income</div>
                    <div className="text-lg font-bold text-purple-600">{debtToIncomeRatio.toFixed(1)}%</div>
                  </div>
                </div>

                {/* Affordability Assessment */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>Debt Affordability</span>
                    <span className={`font-medium ${affordabilityStatusColor}`}>{affordabilityStatus}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`${affordabilityBarColor} h-3 rounded-full transition-all duration-500`}
                      style={{ width: `${affordabilityBarWidth}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">Recommended: Debt payments ≤ 10% of gross income</p>
                </div>

                {/* Charts */}
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-3">Loan Composition</h3>
                  <div style={{ maxHeight: '250px' }}>
                    <canvas ref={loanChartRef}></canvas>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Analysis */}
          <div className="mt-8 border-t pt-6">
            <div className="mb-4 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">📚 Education Loan Tips</h3>
              <p className="text-xs text-blue-800">Take advantage of the grace period to build emergency savings. Consider making interest-only payments during grace period to prevent capitalization and reduce total loan cost.</p>
            </div>
            <div className="grid md:grid-cols-2 gap-4 sm:gap-4 md:gap-6">
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Repayment Schedule</h3>
                <div className="overflow-x-auto border rounded-lg max-h-80 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-2 py-2 text-left border">Year</th>
                        <th className="px-2 py-2 text-right border">Payment</th>
                        <th className="px-2 py-2 text-right border">Principal</th>
                        <th className="px-2 py-2 text-right border">Interest</th>
                        <th className="px-2 py-2 text-right border">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {repaymentSchedule.map((row, index) => (
                        <tr key={row.year} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="px-2 py-2 border font-medium">{row.year}</td>
                          <td className="px-2 py-2 text-right border">{formatCurrency(row.payment)}</td>
                          <td className="px-2 py-2 text-right border text-blue-600">{formatCurrency(row.principal)}</td>
                          <td className="px-2 py-2 text-right border text-red-600">{formatCurrency(row.interest)}</td>
                          <td className="px-2 py-2 text-right border font-medium">{formatCurrency(row.balance)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Payment Breakdown</h3>
                <div style={{ maxHeight: '320px' }}>
                  <canvas ref={paymentChartRef}></canvas>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Formula Section */}
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-semibold text-blue-900 mb-4">📚 Education Loan EMI Calculation Formula</h3>
          <p className="text-blue-800 mb-4">
            Education loan EMI is calculated using the compound interest formula with grace period adjustment:
          </p>
          <div className="bg-white rounded-lg p-4">
            <p className="font-mono text-lg mb-2 text-center">EMI = P × r × (1 + r)^n / [(1 + r)^n - 1]</p>
            <p className="text-sm text-gray-600 mt-4">Where:</p>
            <div className="grid md:grid-cols-2 gap-4 mt-2">
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>EMI</strong> = Equated Monthly Installment</li>
                <li><strong>P</strong> = Principal + Capitalized Interest during Grace Period</li>
              </ul>
              <ul className="text-sm text-gray-600 space-y-1">
                <li><strong>r</strong> = Monthly Interest Rate (Annual Rate ÷ 12)</li>
                <li><strong>n</strong> = Total Number of Monthly Payments</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <section className="prose max-w-none mt-12">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Complete Guide to Education Loans</h2>
            <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6">
              Education loans are specialized financial products designed to help students and families finance higher education costs. These loans typically offer favorable terms including grace periods, income-driven repayment options, and potential tax benefits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Grace Period</h4>
                <p className="text-blue-800">6-month period after graduation before repayment begins</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-3">Flexible Repayment</h4>
                <p className="text-green-800">Multiple repayment plans including income-driven options</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-3">Tax Benefits</h4>
                <p className="text-purple-800">Interest deduction up to $2,500 annually</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Types of Student Loans</h2>
            <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-2 text-left">Loan Type</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Interest Rate</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Credit Check</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Borrowing Limits</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Federal Direct Subsidized</td>
                    <td className="border border-gray-300 px-2 py-2">5.50% (2023-24)</td>
                    <td className="border border-gray-300 px-2 py-2 text-green-600">Not required</td>
                    <td className="border border-gray-300 px-2 py-2">$3,500-$5,500/year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Federal Direct Unsubsidized</td>
                    <td className="border border-gray-300 px-2 py-2">5.50% undergraduate, 7.05% graduate</td>
                    <td className="border border-gray-300 px-2 py-2 text-green-600">Not required</td>
                    <td className="border border-gray-300 px-2 py-2">$5,500-$20,500/year</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Parent PLUS Loan</td>
                    <td className="border border-gray-300 px-2 py-2">8.05% (2023-24)</td>
                    <td className="border border-gray-300 px-2 py-2 text-orange-600">Yes</td>
                    <td className="border border-gray-300 px-2 py-2">Up to cost of attendance</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Private Student Loan</td>
                    <td className="border border-gray-300 px-2 py-2">3.00%-15.00% (variable)</td>
                    <td className="border border-gray-300 px-2 py-2 text-red-600">Required</td>
                    <td className="border border-gray-300 px-2 py-2">Up to total education costs</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Federal vs. Private Student Loans</h2>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Federal Student Loans</h3>
                <div className="space-y-4">
                  <div className="bg-blue-50 rounded-lg p-4">
                    <h4 className="font-semibold text-blue-900 mb-2">✓ Fixed Interest Rates</h4>
                    <p className="text-blue-800 text-sm">Rates set by Congress annually, never change during loan life</p>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4">
                    <h4 className="font-semibold text-green-900 mb-2">✓ Flexible Repayment</h4>
                    <p className="text-green-800 text-sm">Income-driven plans, forgiveness programs, deferment options</p>
                  </div>

                  <div className="bg-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-purple-900 mb-2">✓ No Credit Check</h4>
                    <p className="text-purple-800 text-sm">Most federal loans don't require credit history or cosigner</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Private Student Loans</h3>
                <div className="space-y-4">
                  <div className="bg-orange-50 rounded-lg p-4">
                    <h4 className="font-semibold text-orange-900 mb-2">⚠ Variable Rates</h4>
                    <p className="text-orange-800 text-sm">Rates can increase over time, potentially costly</p>
                  </div>

                  <div className="bg-red-50 rounded-lg p-4">
                    <h4 className="font-semibold text-red-900 mb-2">⚠ Credit Required</h4>
                    <p className="text-red-800 text-sm">Good credit or cosigner needed, rates based on creditworthiness</p>
                  </div>

                  <div className="bg-teal-50 rounded-lg p-4">
                    <h4 className="font-semibold text-teal-900 mb-2">✓ Higher Limits</h4>
                    <p className="text-teal-800 text-sm">Can cover full cost of education including living expenses</p>
                  </div>
                </div>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Student Loan Repayment Plans</h2>
            <div className="overflow-x-auto mb-4 sm:mb-6 md:mb-8">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 px-2 py-2 text-left">Repayment Plan</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Payment Amount</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Term</th>
                    <th className="border border-gray-300 px-2 py-2 text-left">Best For</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Standard Repayment</td>
                    <td className="border border-gray-300 px-2 py-2">Fixed amount</td>
                    <td className="border border-gray-300 px-2 py-2">10 years</td>
                    <td className="border border-gray-300 px-2 py-2">Stable income, lowest total interest</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Extended Repayment</td>
                    <td className="border border-gray-300 px-2 py-2">Fixed or graduated</td>
                    <td className="border border-gray-300 px-2 py-2">Up to 25 years</td>
                    <td className="border border-gray-300 px-2 py-2">Lower monthly payments needed</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Income-Driven (IBR/PAYE)</td>
                    <td className="border border-gray-300 px-2 py-2">10-15% of income</td>
                    <td className="border border-gray-300 px-2 py-2">20-25 years</td>
                    <td className="border border-gray-300 px-2 py-2">Variable income, public service</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-2 py-2 font-medium">Income-Contingent (ICR)</td>
                    <td className="border border-gray-300 px-2 py-2">20% of income</td>
                    <td className="border border-gray-300 px-2 py-2">25 years</td>
                    <td className="border border-gray-300 px-2 py-2">Parent PLUS consolidation loans</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Education Costs by Institution Type</h2>
            <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-blue-900 mb-3">Community College</h4>
                <p className="text-2xl font-bold text-blue-600 mb-2">$3,800/year</p>
                <p className="text-blue-800 text-sm">Average tuition and fees for in-district students</p>
              </div>

              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-green-900 mb-3">Public University</h4>
                <p className="text-2xl font-bold text-green-600 mb-2">$10,950/year</p>
                <p className="text-green-800 text-sm">In-state tuition and fees at 4-year public institutions</p>
              </div>

              <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h4 className="text-lg font-semibold text-purple-900 mb-3">Private University</h4>
                <p className="text-2xl font-bold text-purple-600 mb-2">$39,400/year</p>
                <p className="text-purple-800 text-sm">Average tuition and fees at 4-year private institutions</p>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Student Loan Tax Benefits</h2>
            <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-yellow-900 mb-3">Student Loan Interest Deduction</h3>
                <ul className="text-yellow-800 space-y-2">
                  <li>• Deduct up to $2,500 in student loan interest annually</li>
                  <li>• Available for first 60 months of repayment</li>
                  <li>• Income limits: $70,000-$85,000 (single), $145,000-$175,000 (joint)</li>
                  <li>• Applies to both federal and private student loans</li>
                </ul>
              </div>

              <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-green-900 mb-3">American Opportunity Tax Credit</h3>
                <ul className="text-green-800 space-y-2">
                  <li>• Up to $2,500 credit per eligible student per year</li>
                  <li>• Covers first four years of post-secondary education</li>
                  <li>• 40% refundable (up to $1,000 even if no tax owed)</li>
                  <li>• Income limits: $80,000-$90,000 (single), $160,000-$180,000 (joint)</li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Student Loan Management Strategies</h2>
            <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">During School</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Minimize Borrowing</h4>
                      <p className="text-gray-700 text-sm">Only borrow what you need for essential education expenses</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Consider Interest Payments</h4>
                      <p className="text-gray-700 text-sm">Pay interest on unsubsidized loans while in school</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Track Your Loans</h4>
                      <p className="text-gray-700 text-sm">Use NSLDS to monitor federal loan balances and servicers</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">After Graduation</h3>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-orange-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">1</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Set Up Auto-Pay</h4>
                      <p className="text-gray-700 text-sm">Get 0.25% interest rate reduction with automatic payments</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">2</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Choose Right Plan</h4>
                      <p className="text-gray-700 text-sm">Select repayment plan that fits your income and goals</p>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <span className="flex-shrink-0 w-6 h-6 bg-teal-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-1">3</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Make Extra Payments</h4>
                      <p className="text-gray-700 text-sm">Target highest interest rate loans first (avalanche method)</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4 md:space-y-6 mb-4 sm:mb-6 md:mb-8">
              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What's the difference between subsidized and unsubsidized loans?</h3>
                <p className="text-gray-700">
                  Subsidized loans are need-based, and the government pays the interest while you're in school at least half-time, during grace periods, and deferment. Unsubsidized loans accrue interest from disbursement, regardless of enrollment status.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">How much can I borrow in student loans?</h3>
                <p className="text-gray-700">
                  Federal loan limits vary by year in school and dependency status: $5,500-$12,500 annually for undergraduates, up to $20,500 for graduates. Private loans can cover up to the full cost of attendance minus other financial aid.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Can student loans be forgiven?</h3>
                <p className="text-gray-700">
                  Yes, through programs like Public Service Loan Forgiveness (after 120 qualifying payments in public service), income-driven repayment forgiveness (after 20-25 years), and teacher loan forgiveness (up to $17,500 for qualifying teachers).
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">What happens if I can't make my student loan payments?</h3>
                <p className="text-gray-700">
                  Contact your servicer immediately. Options include deferment, forbearance, income-driven repayment plans, or loan rehabilitation for defaulted loans. Ignoring payments can lead to default, wage garnishment, and credit damage.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Should I consolidate my student loans?</h3>
                <p className="text-gray-700">
                  Federal consolidation simplifies payments and may qualify you for forgiveness programs, but you'll lose benefits like interest rate discounts. Private refinancing can lower rates but eliminates federal protections. Consider your specific situation carefully.
                </p>
              </div>
            </div>
          
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="education-loan-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
        </section>
      </div>
    </>
  );
}
