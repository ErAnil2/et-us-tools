'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface AmortizationRow {
  year: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is included in a mortgage payment?",
    answer: "A mortgage payment typically includes four components, often called PITI: Principal (the loan amount), Interest (cost of borrowing), Taxes (property taxes), and Insurance (homeowner's insurance). If your down payment is less than 20%, you'll also pay PMI (Private Mortgage Insurance). Some payments also include HOA fees if applicable.",
    order: 1
  },
  {
    id: '2',
    question: "How much house can I afford?",
    answer: "Most lenders recommend following the 28/36 rule: your mortgage payment should not exceed 28% of your gross monthly income, and your total debt payments should not exceed 36%. For example, if you earn $6,000/month, aim for a mortgage payment under $1,680. Also consider your savings, down payment, and other financial goals.",
    order: 2
  },
  {
    id: '3',
    question: "What is PMI and how can I avoid it?",
    answer: "PMI (Private Mortgage Insurance) is required when your down payment is less than 20% of the home price. It protects the lender if you default. PMI typically costs 0.5-1% of your loan amount annually. To avoid PMI, save for a 20% down payment, look into VA or USDA loans (no PMI), or ask about lender-paid PMI options.",
    order: 3
  },
  {
    id: '4',
    question: "Should I choose a 15-year or 30-year mortgage?",
    answer: "A 15-year mortgage has higher monthly payments but lower interest rates and total interest paid. A 30-year mortgage offers lower monthly payments but costs more in total interest. Choose 15-year if you can afford higher payments and want to build equity faster. Choose 30-year for lower payments and more financial flexibility.",
    order: 4
  },
  {
    id: '5',
    question: "How does the interest rate affect my payment?",
    answer: "Interest rates significantly impact your monthly payment and total cost. For a $300,000 loan over 30 years, each 0.5% rate increase adds about $85/month and $30,000+ in total interest. Even a 0.25% difference matters over time. Shop multiple lenders and consider buying points to lower your rate if you plan to stay long-term.",
    order: 5
  }
];

export default function MortgagePaymentCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('mortgage-payment-calculator');

  const [homePrice, setHomePrice] = useState(400000);
  const [downPayment, setDownPayment] = useState(80000);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate, setInterestRate] = useState(6.5);
  const [loanTerm, setLoanTerm] = useState(30);
  const [propertyTax, setPropertyTax] = useState(5000);
  const [homeInsurance, setHomeInsurance] = useState(1200);
  const [pmiRate, setPmiRate] = useState(0.5);
  const [hoaFees, setHoaFees] = useState(0);
  const [showFullSchedule, setShowFullSchedule] = useState(false);
  const [hoveredSegment, setHoveredSegment] = useState<number | null>(null);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  const formatCurrencyDecimals = (value: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  const syncDownPayment = (type: 'percent' | 'dollar', value: number) => {
    if (type === 'percent') {
      setDownPaymentPercent(value);
      setDownPayment(Math.round(homePrice * (value / 100)));
    } else {
      setDownPayment(value);
      setDownPaymentPercent(homePrice > 0 ? Number(((value / homePrice) * 100).toFixed(1)) : 0);
    }
  };

  const results = useMemo(() => {
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;

    let monthlyPI = 0;
    if (monthlyRate === 0) {
      monthlyPI = loanAmount / numPayments;
    } else {
      monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    }

    const dpPercent = homePrice > 0 ? (downPayment / homePrice) * 100 : 0;
    const monthlyPMI = dpPercent < 20 ? (loanAmount * (pmiRate / 100) / 12) : 0;
    const monthlyPropertyTax = propertyTax / 12;
    const monthlyInsurance = homeInsurance / 12;
    const totalMonthly = monthlyPI + monthlyPMI + monthlyPropertyTax + monthlyInsurance + hoaFees;

    const totalInterest = (monthlyPI * numPayments) - loanAmount;
    const totalPayments = monthlyPI * numPayments;

    const recommendedIncome = (totalMonthly * 12) / 0.28;

    return {
      loanAmount,
      monthlyPI,
      monthlyPMI,
      monthlyPropertyTax,
      monthlyInsurance,
      totalMonthly,
      totalInterest,
      totalPayments,
      recommendedIncome,
      dpPercent
    };
  }, [homePrice, downPayment, interestRate, loanTerm, propertyTax, homeInsurance, pmiRate, hoaFees]);

  // Amortization Schedule
  const amortizationData = useMemo(() => {
    const data: AmortizationRow[] = [];
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;
    const numPayments = loanTerm * 12;
    const monthlyPayment = results.monthlyPI;

    let balance = loanAmount;

    for (let year = 1; year <= loanTerm; year++) {
      let yearPrincipal = 0;
      let yearInterest = 0;

      for (let month = 1; month <= 12; month++) {
        const interestPayment = balance * monthlyRate;
        const principalPayment = monthlyPayment - interestPayment;
        yearInterest += interestPayment;
        yearPrincipal += principalPayment;
        balance -= principalPayment;
      }

      data.push({
        year,
        payment: monthlyPayment * 12,
        principal: yearPrincipal,
        interest: yearInterest,
        balance: Math.max(0, balance)
      });
    }

    return data;
  }, [homePrice, downPayment, interestRate, loanTerm, results.monthlyPI]);

  // What-If Scenarios
  const scenarios = useMemo(() => {
    const calcMonthly = (price: number, down: number, rate: number, term: number) => {
      const loan = price - down;
      const monthlyRate = rate / 100 / 12;
      const numPayments = term * 12;
      if (monthlyRate === 0) return loan / numPayments;
      return loan * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
    };

    const base = results.monthlyPI;

    return [
      {
        title: '15-Year Term',
        description: 'Faster payoff',
        monthly: calcMonthly(homePrice, downPayment, interestRate, 15),
        diff: calcMonthly(homePrice, downPayment, interestRate, 15) - base,
        savings: (base * loanTerm * 12) - (calcMonthly(homePrice, downPayment, interestRate, 15) * 15 * 12) - results.loanAmount + results.loanAmount
      },
      {
        title: 'Lower Rate',
        description: '-1% interest rate',
        monthly: calcMonthly(homePrice, downPayment, interestRate - 1, loanTerm),
        diff: calcMonthly(homePrice, downPayment, interestRate - 1, loanTerm) - base
      },
      {
        title: 'Higher Down',
        description: '+5% down payment',
        monthly: calcMonthly(homePrice, homePrice * (downPaymentPercent + 5) / 100, interestRate, loanTerm),
        diff: calcMonthly(homePrice, homePrice * (downPaymentPercent + 5) / 100, interestRate, loanTerm) - base
      }
    ];
  }, [homePrice, downPayment, downPaymentPercent, interestRate, loanTerm, results.monthlyPI, results.loanAmount]);

  // Loan Term Comparison
  const termComparisons = useMemo(() => {
    const terms = [15, 20, 25, 30];
    const loanAmount = homePrice - downPayment;
    const monthlyRate = interestRate / 100 / 12;

    return terms.map(term => {
      const numPayments = term * 12;
      let monthlyPI = 0;
      if (monthlyRate === 0) {
        monthlyPI = loanAmount / numPayments;
      } else {
        monthlyPI = loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1);
      }
      const totalInterest = (monthlyPI * numPayments) - loanAmount;
      const totalPayment = monthlyPI * numPayments;
      const baseline = results.totalInterest;
      const savings = baseline - totalInterest;

      return { term, monthlyPI, totalInterest, totalPayment, savings };
    });
  }, [homePrice, downPayment, interestRate, results.totalInterest]);

  // SVG Donut Chart
  const renderDonutChart = () => {
    const segments = [
      { label: 'Principal & Interest', value: results.monthlyPI, color: '#3B82F6' },
      { label: 'Property Tax', value: results.monthlyPropertyTax, color: '#10B981' },
      { label: 'Insurance', value: results.monthlyInsurance, color: '#8B5CF6' },
      ...(results.monthlyPMI > 0 ? [{ label: 'PMI', value: results.monthlyPMI, color: '#EF4444' }] : []),
      ...(hoaFees > 0 ? [{ label: 'HOA', value: hoaFees, color: '#F59E0B' }] : [])
    ];

    const total = segments.reduce((sum, s) => sum + s.value, 0);
    if (total === 0) return null;

    const radius = 70;
    const strokeWidth = 20;
    const circumference = 2 * Math.PI * radius;

    let offset = 0;

    return (
      <div className="flex flex-col items-center">
        <svg width="200" height="200" viewBox="0 0 200 200" className="transform -rotate-90">
          {segments.map((seg, i) => {
            const percent = (seg.value / total) * 100;
            const dashArray = (percent / 100) * circumference;
            const currentOffset = offset;
            offset += dashArray;

            return (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={radius}
                fill="none"
                stroke={seg.color}
                strokeWidth={hoveredSegment === i ? strokeWidth + 4 : strokeWidth}
                strokeDasharray={`${dashArray} ${circumference}`}
                strokeDashoffset={-currentOffset}
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHoveredSegment(i)}
                onMouseLeave={() => setHoveredSegment(null)}
              />
            );
          })}
          <text x="100" y="95" textAnchor="middle" fill="#374151" fontSize="14" fontWeight="700" transform="rotate(90 100 100)">
            {formatCurrency(total)}
          </text>
          <text x="100" y="112" textAnchor="middle" fill="#6B7280" fontSize="10" transform="rotate(90 100 100)">
            /month
          </text>
        </svg>
        <div className="flex flex-wrap justify-center gap-3 mt-4">
          {segments.map((seg, i) => (
            <div key={i} className={`flex items-center gap-2 px-2 py-1 rounded ${hoveredSegment === i ? 'bg-gray-100' : ''}`}>
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: seg.color }}></div>
              <span className="text-xs text-gray-600">{seg.label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const displayedAmortization = showFullSchedule ? amortizationData : amortizationData.slice(0, 10);

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-4 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Mortgage Payment Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate monthly mortgage payments including principal, interest, taxes, insurance, and PMI
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}

      <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Mortgage Details</h2>

            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Home Price</label>
                  <span className="text-sm font-semibold text-blue-600">{formatCurrency(homePrice)}</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="2000000"
                  step="5000"
                  value={homePrice}
                  onChange={(e) => {
                    const newPrice = Number(e.target.value);
                    setHomePrice(newPrice);
                    setDownPayment(Math.round(newPrice * (downPaymentPercent / 100)));
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>$50K</span>
                  <span>$2M</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Down Payment</label>
                  <span className="text-sm font-semibold text-emerald-600">{formatCurrency(downPayment)} ({downPaymentPercent}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={downPaymentPercent}
                  onChange={(e) => syncDownPayment('percent', Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0%</span>
                  <span>50%</span>
                </div>
                {downPaymentPercent < 20 && (
                  <p className="text-xs text-amber-600 mt-1">PMI required for down payments under 20%</p>
                )}
              </div>

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-gray-700">Interest Rate</label>
                  <span className="text-sm font-semibold text-rose-600">{interestRate}%</span>
                </div>
                <input
                  type="range"
                  min="2"
                  max="12"
                  step="0.125"
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>2%</span>
                  <span>12%</span>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">Loan Term</label>
                <div className="grid grid-cols-4 gap-2">
                  {[15, 20, 25, 30].map(term => (
                    <button
                      key={term}
                      onClick={() => setLoanTerm(term)}
                      className={`py-2 px-3 rounded-lg font-medium text-sm transition-colors ${loanTerm === term ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      {term} yrs
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Property Tax/year</label>
                  <input
                    type="number"
                    value={propertyTax}
                    onChange={(e) => setPropertyTax(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">Insurance/year</label>
                  <input
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500 block mb-1">PMI Rate (%)</label>
                  <input
                    type="number"
                    value={pmiRate}
                    onChange={(e) => setPmiRate(Number(e.target.value))}
                    step="0.1"
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-500 block mb-1">HOA/month</label>
                  <input
                    type="number"
                    value={hoaFees}
                    onChange={(e) => setHoaFees(Number(e.target.value))}
                    className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Payment Breakdown</h2>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 mb-5 border border-blue-100">
              <div className="text-sm text-blue-700 mb-1">Total Monthly Payment</div>
              <div className="text-3xl sm:text-3xl md:text-4xl font-bold text-blue-600">{formatCurrencyDecimals(results.totalMonthly)}</div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                <div className="text-xs text-gray-500 mb-1">Loan Amount</div>
                <div className="text-lg font-bold text-gray-800">{formatCurrency(results.loanAmount)}</div>
              </div>
              <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
                <div className="text-xs text-blue-600 mb-1">Principal & Interest</div>
                <div className="text-lg font-bold text-blue-600">{formatCurrencyDecimals(results.monthlyPI)}</div>
              </div>
              <div className="bg-emerald-50 rounded-lg p-3 border border-emerald-200">
                <div className="text-xs text-emerald-600 mb-1">Property Tax</div>
                <div className="text-lg font-bold text-emerald-600">{formatCurrencyDecimals(results.monthlyPropertyTax)}</div>
              </div>
              <div className="bg-purple-50 rounded-lg p-3 border border-purple-200">
                <div className="text-xs text-purple-600 mb-1">Insurance</div>
                <div className="text-lg font-bold text-purple-600">{formatCurrencyDecimals(results.monthlyInsurance)}</div>
              </div>
            </div>

            {results.monthlyPMI > 0 && (
              <div className="bg-red-50 rounded-lg p-3 border border-red-200 mb-5">
                <div className="text-xs text-red-600 mb-1">PMI (until 20% equity)</div>
                <div className="text-lg font-bold text-red-600">{formatCurrencyDecimals(results.monthlyPMI)}</div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 mb-5">
              <div className="bg-amber-50 rounded-lg p-3 border border-amber-200">
                <div className="text-xs text-amber-600 mb-1">Total Interest</div>
                <div className="text-lg font-bold text-amber-600">{formatCurrency(results.totalInterest)}</div>
              </div>
              <div className="bg-indigo-50 rounded-lg p-3 border border-indigo-200">
                <div className="text-xs text-indigo-600 mb-1">Recommended Income</div>
                <div className="text-lg font-bold text-indigo-600">{formatCurrency(results.recommendedIncome)}/yr</div>
              </div>
            </div>

            {/* Donut Chart */}
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <h3 className="text-sm font-semibold text-gray-700 text-center mb-3">Monthly Payment Distribution</h3>
              {renderDonutChart()}
            </div>
          </div>
        </div>
      </div>

      {/* Loan Balance Over Time Chart */}
      {amortizationData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Loan Balance Over Time</h2>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="balanceAreaGradient" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = 20 + (i * 260 / 4);
                const value = results.loanAmount * (1 - i * 0.25);
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x="60" y={y + 5} textAnchor="end" fontSize="12" fill="#6b7280">
                      {formatCurrency(value)}
                    </text>
                  </g>
                );
              })}

              {/* X-axis */}
              {[0, 0.25, 0.5, 0.75, 1].map((percent, i) => {
                const x = 70 + percent * 700;
                const year = Math.round(loanTerm * percent);
                return (
                  <text key={i} x={x} y="290" textAnchor="middle" fontSize="12" fill="#6b7280">
                    Yr {year}
                  </text>
                );
              })}

              {/* Balance area */}
              <path
                d={(() => {
                  const points = amortizationData.map((d, idx) => {
                    const x = 70 + (idx / (amortizationData.length - 1)) * 700;
                    const y = 20 + ((results.loanAmount - d.balance) / results.loanAmount) * 260;
                    return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                  }).join(' ');
                  return `${points} L 770 280 L 70 280 Z`;
                })()}
                fill="url(#balanceAreaGradient)"
              />

              {/* Balance line */}
              <path
                d={amortizationData.map((d, idx) => {
                  const x = 70 + (idx / (amortizationData.length - 1)) * 700;
                  const y = 20 + ((results.loanAmount - d.balance) / results.loanAmount) * 260;
                  return `${idx === 0 ? 'M' : 'L'} ${x} ${y}`;
                }).join(' ')}
                stroke="#3b82f6"
                strokeWidth="3"
                fill="none"
              />
            </svg>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 text-center mt-4">
            Your remaining balance decreases from {formatCurrency(results.loanAmount)} to $0
          </p>
        </div>
      )}

      {/* Yearly Amortization Breakdown Chart */}
      {amortizationData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Principal vs Interest by Year</h2>
          <div className="w-full overflow-x-auto">
            <svg viewBox="0 0 800 300" className="w-full h-auto">
              <defs>
                <linearGradient id="mortgagePaymentPrincipalBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.6" />
                </linearGradient>
                <linearGradient id="mortgagePaymentInterestBar" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#f97316" stopOpacity="0.9" />
                  <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              {[0, 1, 2, 3, 4].map((i) => {
                const y = 20 + (i * 260 / 4);
                const maxYearlyPayment = results.monthlyPI * 12 * 1.1;
                return (
                  <g key={i}>
                    <line x1="70" y1={y} x2="770" y2={y} stroke="#e5e7eb" strokeWidth="1" />
                    <text x="60" y={y + 5} textAnchor="end" fontSize="11" fill="#6b7280">
                      ${Math.round((maxYearlyPayment * (1 - i * 0.25)) / 1000)}K
                    </text>
                  </g>
                );
              })}

              {/* Stacked bars */}
              {amortizationData.map((d, idx) => {
                const barWidth = 680 / amortizationData.length - 5;
                const x = 75 + idx * (680 / amortizationData.length);
                const maxYearlyPayment = results.monthlyPI * 12 * 1.1;
                const principalHeight = (d.principal / maxYearlyPayment) * 260;
                const interestHeight = (d.interest / maxYearlyPayment) * 260;

                return (
                  <g key={idx}>
                    {/* Principal bar */}
                    <rect
                      x={x}
                      y={280 - principalHeight}
                      width={barWidth}
                      height={principalHeight}
                      fill="url(#mortgagePaymentPrincipalBar)"
                      stroke="#2563eb"
                      strokeWidth="1"
                    />
                    {/* Interest bar */}
                    <rect
                      x={x}
                      y={280 - principalHeight - interestHeight}
                      width={barWidth}
                      height={interestHeight}
                      fill="url(#mortgagePaymentInterestBar)"
                      stroke="#ea580c"
                      strokeWidth="1"
                    />
                    {/* Year label */}
                    {(idx % Math.ceil(amortizationData.length / 10) === 0 || idx === amortizationData.length - 1) && (
                      <text
                        x={x + barWidth / 2}
                        y="295"
                        textAnchor="middle"
                        fontSize="10"
                        fill="#6b7280"
                      >
                        {d.year}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
          <div className="flex justify-center gap-3 sm:gap-4 md:gap-6 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-600 rounded"></div>
              <span className="text-xs sm:text-sm text-gray-600">Principal</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-600 rounded"></div>
              <span className="text-xs sm:text-sm text-gray-600">Interest</span>
            </div>
          </div>
        </div>
      )}

      {/* Loan Term Comparison */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Compare Loan Terms</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {termComparisons.map((comp) => (
            <div
              key={comp.term}
              className={`rounded-lg p-4 border-2 transition-all ${
                comp.term === loanTerm
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 bg-white hover:border-blue-300'
              }`}
            >
              <div className="text-center mb-3">
                <div className={`text-2xl font-bold ${comp.term === loanTerm ? 'text-blue-600' : 'text-gray-800'}`}>
                  {comp.term} Years
                </div>
                {comp.term === loanTerm && (
                  <div className="text-xs text-blue-600 font-medium mt-1">Current</div>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Monthly:</span>
                  <span className="font-semibold">{formatCurrency(comp.monthlyPI)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Interest:</span>
                  <span className="font-semibold text-orange-600">{formatCurrency(comp.totalInterest)}</span>
                </div>
                {comp.term !== loanTerm && (
                  <div className={`flex justify-between pt-2 border-t ${comp.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    <span className="text-xs">vs {loanTerm}yr:</span>
                    <span className="text-xs font-semibold">
                      {comp.savings > 0 ? 'Save' : 'Pay'} {formatCurrency(Math.abs(comp.savings))}
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs sm:text-sm text-gray-600 text-center mt-6">
          Shorter terms have higher monthly payments but save thousands in interest
        </p>
      </div>

      {/* Yearly Amortization Table */}
      {amortizationData.length > 0 && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="flex justify-between items-center mb-3 sm:mb-4 md:mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Yearly Amortization Schedule</h2>
            <button
              onClick={() => setShowFullSchedule(!showFullSchedule)}
              className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm"
            >
              {showFullSchedule ? 'Show Less' : 'Show All'}
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b-2 border-gray-200">
                  <th className="px-2 sm:px-4 py-3 text-left font-semibold text-gray-700">Year</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700">Payment</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700">Principal</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700">Interest</th>
                  <th className="px-2 sm:px-4 py-3 text-right font-semibold text-gray-700">Balance</th>
                </tr>
              </thead>
              <tbody>
                {displayedAmortization.map((row, idx) => (
                  <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="px-2 sm:px-4 py-2 font-medium text-gray-800">{row.year}</td>
                    <td className="px-2 sm:px-4 py-2 text-right">{formatCurrency(row.payment)}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-blue-600">{formatCurrency(row.principal)}</td>
                    <td className="px-2 sm:px-4 py-2 text-right text-orange-600">{formatCurrency(row.interest)}</td>
                    <td className="px-2 sm:px-4 py-2 text-right font-semibold">{formatCurrency(row.balance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!showFullSchedule && amortizationData.length > 10 && (
            <p className="text-xs sm:text-sm text-gray-500 text-center mt-4">
              Showing first 10 years. Click "Show All" to see all {amortizationData.length} years
            </p>
          )}
        </div>
      )}

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Mortgage Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Mortgage Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
          {[
            { href: '/us/tools/calculators/mortgage-amortization-calculator', title: 'Amortization', description: 'View payment schedule', icon: '📊' },
            { href: '/us/tools/calculators/mortgage-refinance-calculator', title: 'Refinance', description: 'Compare refinancing', icon: '🔄' },
            { href: '/us/tools/calculators/home-affordability-calculator', title: 'Affordability', description: 'How much can you afford', icon: '🏠' },
            { href: '/us/tools/calculators/mortgage-points-calculator', title: 'Points', description: 'Buy down your rate', icon: '💰' },
            { href: '/us/tools/calculators/rent-vs-buy-calculator', title: 'Rent vs Buy', description: 'Compare options', icon: '🤔' },
            { href: '/us/tools/calculators/loan-calculator', title: 'Loan Calculator', description: 'General loan calc', icon: '💳' },
            { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Investment growth', icon: '📈' },
            { href: '/us/tools/calculators/debt-to-income-calculator', title: 'DTI Calculator', description: 'Check your ratio', icon: '📋' }
          ].map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-xl p-3 md:p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-2 md:mb-3 text-lg md:text-2xl">
                  {calc.icon}
                </div>
                <h3 className="text-xs md:text-sm font-semibold text-gray-900 mb-0.5 md:mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-[10px] md:text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Your Mortgage Payment</h2>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Your monthly mortgage payment is made up of several components, commonly referred to as PITI: Principal, Interest, Taxes, and Insurance. Understanding each component helps you budget accurately and make informed decisions about your home purchase.
        </p>

        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          The principal portion of your payment reduces your loan balance, building equity in your home. Interest is the cost of borrowing money from the lender. Property taxes and homeowner&apos;s insurance are often collected by the lender through an escrow account to ensure these essential payments are made on time.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-xl p-4">
            <h3 className="font-semibold text-blue-800 mb-2">Principal</h3>
            <p className="text-sm text-gray-600">The amount that reduces your loan balance and builds home equity</p>
          </div>
          <div className="bg-orange-50 rounded-xl p-4">
            <h3 className="font-semibold text-orange-800 mb-2">Interest</h3>
            <p className="text-sm text-gray-600">The cost of borrowing, determined by your rate and balance</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-2">Property Taxes</h3>
            <p className="text-sm text-gray-600">Local taxes based on your home&apos;s assessed value</p>
          </div>
          <div className="bg-purple-50 rounded-xl p-4">
            <h3 className="font-semibold text-purple-800 mb-2">Insurance</h3>
            <p className="text-sm text-gray-600">Protection for your home and lender&apos;s investment</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">What is PMI and When is it Required?</h3>
        <p className="text-gray-600 mb-4 leading-relaxed">
          Private Mortgage Insurance (PMI) is typically required when your down payment is less than 20% of the home&apos;s purchase price. PMI protects the lender if you default on the loan. The cost usually ranges from 0.5% to 1% of the loan amount annually. Once you reach 20% equity in your home, you can request to have PMI removed, potentially saving hundreds of dollars per month.
        </p>

        <h3 className="text-lg font-semibold text-gray-800 mb-3">Factors That Affect Your Mortgage Payment</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Loan Amount:</strong> Larger loans mean higher monthly payments</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Interest Rate:</strong> Even 0.5% can add thousands over the loan term</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Loan Term:</strong> 15-year loans have higher payments but less interest</span>
              </li>
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Down Payment:</strong> More down means lower payments and no PMI</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Property Location:</strong> Taxes and insurance vary by area</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-1">•</span>
                <span><strong>Credit Score:</strong> Better credit means better interest rates</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mortgage-payment-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Disclaimer</h3>
            <p className="text-sm text-amber-700">
              This calculator provides estimates for informational purposes only. Actual mortgage payments may vary based on lender requirements, credit score, and other factors. Consult with a mortgage professional for accurate quotes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
