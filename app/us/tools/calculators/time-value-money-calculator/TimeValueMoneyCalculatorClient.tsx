'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Time Value Money Calculator?",
    answer: "A Time Value Money Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function TimeValueMoneyCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('time-value-money-calculator');

  const [calculationType, setCalculationType] = useState<'futureValue' | 'presentValue'>('futureValue');
  const [presentValue, setPresentValue] = useState(10000);
  const [futureValue, setFutureValue] = useState(16105);
  const [interestRate, setInterestRate] = useState(8);
  const [timePeriod, setTimePeriod] = useState(6);
  const [compounding, setCompounding] = useState<string>('12');
  const [payment, setPayment] = useState(0);

  const [mainResult, setMainResult] = useState(16105.10);
  const [initialAmount, setInitialAmount] = useState(10000);
  const [totalInterest, setTotalInterest] = useState(6105.10);
  const [totalPayments, setTotalPayments] = useState(0);
  const [effectiveRate, setEffectiveRate] = useState(8.30);
  const [growthMultiplier, setGrowthMultiplier] = useState(1.61);
  const [resultLabel, setResultLabel] = useState('Future Value');
  const [resultDescription, setResultDescription] = useState('Value after 6 years at 8% annual interest');
  const [comparisonData, setComparisonData] = useState<any[]>([]);

  useEffect(() => {
    calculate();
  }, [calculationType, presentValue, futureValue, interestRate, timePeriod, compounding, payment]);

  const switchCalculationType = (type: 'futureValue' | 'presentValue') => {
    setCalculationType(type);
  };

  const calculate = () => {
    const rate = parseFloat(interestRate.toString()) / 100 || 0;
    const period = parseFloat(timePeriod.toString()) || 0;
    const compoundingValue = compounding;
    const pmt = parseFloat(payment.toString()) || 0;

    let n = parseFloat(compoundingValue);
    let isContinuous = compoundingValue === 'continuous';

    let pv: number, fv: number, result: number;

    if (calculationType === 'futureValue') {
      pv = parseFloat(presentValue.toString()) || 0;

      if (isContinuous) {
        result = pv * Math.exp(rate * period);
      } else {
        result = pv * Math.pow(1 + rate / n, n * period);
      }

      // Add annuity payments if any
      if (pmt > 0 && !isContinuous) {
        const annuityFV = pmt * (Math.pow(1 + rate / n, n * period) - 1) / (rate / n);
        result += annuityFV;
      }

      fv = result;

      setResultLabel('Future Value');
      setMainResult(result);
      setResultDescription(`Value after ${period} years at ${(rate * 100).toFixed(2)}% annual interest`);
      setInitialAmount(pv);
    } else {
      fv = parseFloat(futureValue.toString()) || 0;

      if (isContinuous) {
        result = fv / Math.exp(rate * period);
      } else {
        result = fv / Math.pow(1 + rate / n, n * period);
      }

      pv = result;

      setResultLabel('Present Value');
      setMainResult(result);
      setResultDescription(`Present value of $${fv.toLocaleString()} in ${period} years`);
      setInitialAmount(fv);
    }

    // Calculate additional metrics
    const interest = fv - pv - (pmt * n * period);
    const payments = pmt * n * period;
    const effRate = isContinuous ? Math.exp(rate) - 1 : Math.pow(1 + rate / n, n) - 1;
    const multiplier = pv > 0 ? fv / pv : 0;

    setTotalInterest(interest);
    setTotalPayments(payments);
    setEffectiveRate(effRate * 100);
    setGrowthMultiplier(multiplier);

    // Update comparison table
    updateComparisonTable(pv, rate, n, pmt, isContinuous);
  };

  const updateComparisonTable = (pv: number, rate: number, n: number, pmt: number, continuous: boolean) => {
    const years = [1, 2, 3, 5, 10, 15, 20, 25, 30];
    const data = years.map(year => {
      let fv: number;
      if (continuous) {
        fv = pv * Math.exp(rate * year);
      } else {
        fv = pv * Math.pow(1 + rate / n, n * year);
      }

      if (pmt > 0 && !continuous) {
        const annuityFV = pmt * (Math.pow(1 + rate / n, n * year) - 1) / (rate / n);
        fv += annuityFV;
      }

      const interestEarned = fv - pv - (pmt * n * year);
      const totalGrowth = pv > 0 ? ((fv / pv - 1) * 100) : 0;

      return {
        year,
        value: fv,
        interestEarned,
        totalGrowth
      };
    });

    setComparisonData(data);
  };

  const formatCurrency = (value: number) => {
    return value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 text-center mb-2">{getH1('Time Value of Money Calculator Online')}</h1>
      <p className="text-gray-600 text-center mb-4 sm:mb-6 md:mb-8 max-w-2xl mx-auto">
        Calculate present value, future value, and understand how money grows over time with compound interest.
      </p>

      <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <div className="mb-3 sm:mb-4 md:mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">Calculation Type</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => switchCalculationType('futureValue')}
                className={calculationType === 'futureValue'
                  ? "px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  : "px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"}
              >
                Future Value
              </button>
              <button
                onClick={() => switchCalculationType('presentValue')}
                className={calculationType === 'presentValue'
                  ? "px-2 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  : "px-2 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"}
              >
                Present Value
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Present Value Input (for FV calculation) */}
            <div className={calculationType === 'futureValue' ? '' : 'hidden'}>
              <label htmlFor="presentValue" className="block text-sm font-medium text-gray-700 mb-2">Present Value (PV) ($)</label>
              <input
                type="number"
                id="presentValue"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={presentValue}
                min="0"
                step="0.01"
                onChange={(e) => setPresentValue(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Future Value Input (for PV calculation) */}
            <div className={calculationType === 'presentValue' ? '' : 'hidden'}>
              <label htmlFor="futureValue" className="block text-sm font-medium text-gray-700 mb-2">Future Value (FV) ($)</label>
              <input
                type="number"
                id="futureValue"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={futureValue}
                min="0"
                step="0.01"
                onChange={(e) => setFutureValue(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Interest Rate */}
            <div>
              <label htmlFor="interestRate" className="block text-sm font-medium text-gray-700 mb-2">Interest Rate (% per year)</label>
              <input
                type="number"
                id="interestRate"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={interestRate}
                min="0"
                max="100"
                step="0.01"
                onChange={(e) => setInterestRate(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Time Period */}
            <div>
              <label htmlFor="timePeriod" className="block text-sm font-medium text-gray-700 mb-2">Time Period (years)</label>
              <input
                type="number"
                id="timePeriod"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={timePeriod}
                min="0"
                step="0.1"
                onChange={(e) => setTimePeriod(parseFloat(e.target.value) || 0)}
              />
            </div>

            {/* Compounding Frequency */}
            <div>
              <label htmlFor="compounding" className="block text-sm font-medium text-gray-700 mb-2">Compounding Frequency</label>
              <select
                id="compounding"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={compounding}
                onChange={(e) => setCompounding(e.target.value)}
              >
                <option value="1">Annually</option>
                <option value="2">Semi-annually</option>
                <option value="4">Quarterly</option>
                <option value="12">Monthly</option>
                <option value="365">Daily</option>
                <option value="continuous">Continuously</option>
              </select>
            </div>

            {/* Payment (for annuities) */}
            <div>
              <label htmlFor="payment" className="block text-sm font-medium text-gray-700 mb-2">
                Regular Payment (PMT) ($)
                <span className="text-gray-500 text-xs">Optional - for annuities</span>
              </label>
              <input
                type="number"
                id="payment"
                className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={payment}
                min="0"
                step="0.01"
                onChange={(e) => setPayment(parseFloat(e.target.value) || 0)}
              />
            </div>

            <button
              onClick={calculate}
              className="w-full px-2 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate
            </button>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Results */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Results</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Result */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 md:p-6 text-center">
              <h3 className="text-sm font-medium text-gray-700 mb-2">{resultLabel}</h3>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-600 mb-2">${formatCurrency(mainResult)}</div>
              <p className="text-sm text-gray-600">{resultDescription}</p>
            </div>

            {/* Growth Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Initial Amount:</span>
                <span className="font-semibold">${formatCurrency(initialAmount)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Interest Earned:</span>
                <span className="font-semibold text-green-600">${formatCurrency(totalInterest)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Total Payments:</span>
                <span className="font-semibold">${formatCurrency(totalPayments)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b">
                <span className="text-gray-600">Effective Annual Rate:</span>
                <span className="font-semibold">{effectiveRate.toFixed(2)}%</span>
              </div>
            </div>

            {/* Growth Multiplier */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-1">Growth Multiplier</h3>
              <div className="text-2xl font-bold text-green-600">{growthMultiplier.toFixed(2)}x</div>
              <p className="text-xs text-gray-600">Your money will grow by this factor</p>
            </div>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-3 text-left">Years</th>
                <th className="px-2 py-3 text-right">Value</th>
                <th className="px-2 py-3 text-right">Interest Earned</th>
                <th className="px-2 py-3 text-right">Total Growth</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {comparisonData.map((row) => (
                <tr key={row.year}>
                  <td className="px-2 py-3">{row.year}</td>
                  <td className="px-2 py-3 text-right">${formatCurrency(row.value)}</td>
                  <td className="px-2 py-3 text-right text-green-600">${formatCurrency(row.interestEarned)}</td>
                  <td className="px-2 py-3 text-right">{row.totalGrowth.toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
{/* Educational Content */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8 mb-4 sm:mb-6 md:mb-8">
        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Value of Money Concepts</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Present Value (PV):</strong> Current worth of a future amount of money
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Future Value (FV):</strong> Value of current money at a future date
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Interest Rate (r):</strong> Rate of return or discount rate
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
              <div>
                <strong>Time (n):</strong> Number of periods for the investment
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-3 sm:p-4 md:p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Formulas Used</h3>
          <div className="space-y-3 text-sm text-gray-600">
            <div>
              <strong>Future Value (Compound Interest):</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded">FV = PV × (1 + r/n)^(nt)</code>
            </div>
            <div>
              <strong>Present Value:</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded">PV = FV / (1 + r/n)^(nt)</code>
            </div>
            <div>
              <strong>Effective Annual Rate:</strong>
              <code className="block mt-1 p-2 bg-gray-100 rounded">EAR = (1 + r/n)^n - 1</code>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              Where: PV = Present Value, FV = Future Value, r = interest rate, n = compounding frequency, t = time
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mt-8 prose prose-gray max-w-none">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">The Time Value of Money Explained</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          The time value of money (TVM) is a foundational concept in finance stating that a dollar today is worth more than a dollar in the future. This principle exists because money available today can be invested to earn returns, creating opportunity cost for delayed receipt. Understanding TVM is essential for making sound financial decisions—from comparing loan offers and evaluating investments to planning retirement and negotiating salary packages with deferred compensation.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2 text-base">Present Value (PV)</h3>
            <p className="text-xs text-gray-600 mb-2">The current worth of a future sum of money, discounted at a specified rate of return.</p>
            <code className="block text-xs bg-white p-2 rounded">PV = FV / (1 + r)^n</code>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2 text-base">Future Value (FV)</h3>
            <p className="text-xs text-gray-600 mb-2">What a current sum will be worth at a future date, given a specific interest rate.</p>
            <code className="block text-xs bg-white p-2 rounded">FV = PV × (1 + r)^n</code>
          </div>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Why Time Value of Money Matters</h2>
        <p className="text-sm text-gray-600 mb-4 leading-relaxed">
          TVM calculations underpin nearly every financial decision. When comparing a $50,000 salary today versus $55,000 next year, you need to discount the future amount to determine its present value. Mortgage lenders use TVM to structure loan payments so that fixed monthly amounts cover both principal and interest over the loan term. Retirement planning relies on FV calculations to determine how much your savings will grow over decades of compounding.
        </p>

        <h2 className="text-xl font-semibold text-gray-800 mb-4">Compounding Frequency Impact</h2>
        <p className="text-sm text-gray-600 leading-relaxed">
          How often interest compounds significantly affects the time value of money. Annual compounding applies interest once per year, while monthly compounding divides the annual rate by 12 and applies it 12 times. More frequent compounding accelerates growth: $10,000 at 10% compounded annually becomes $25,937 after 10 years, but compounded daily it reaches $27,183—a difference of $1,246 from compounding frequency alone. The effective annual rate (EAR) formula converts different compounding frequencies into comparable annual returns.
        </p>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-5">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the difference between present value and future value?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Present value (PV) answers &quot;What is a future amount worth today?&quot; while future value (FV) answers &quot;What will today&apos;s amount be worth in the future?&quot; They are inverse calculations using the same variables. PV discounts future cash flows backward using a discount rate, useful for evaluating investments or comparing payment options. FV projects current amounts forward using a growth rate, essential for retirement planning and savings goals. Both use the same rate (r) and time period (n), just in opposite directions.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How do I choose the right discount rate?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The discount rate should reflect your opportunity cost—what you could earn on alternative investments of similar risk. For low-risk calculations, use rates comparable to Treasury bonds or high-yield savings (3-5%). For stock market investments, historical equity returns of 7-10% are common. Business valuations often use weighted average cost of capital (WACC). When comparing personal financial decisions, your actual expected investment return is most appropriate. Higher discount rates reduce present values, making future payments appear less valuable today.
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is the Rule of 72 and how accurate is it?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              The Rule of 72 is a mental math shortcut for estimating doubling time: divide 72 by the interest rate to find years until your money doubles. At 8%, money doubles in approximately 9 years (72÷8). The rule works best for rates between 6-10%, where it&apos;s accurate within a few months. At very low rates (1-3%), the Rule of 70 is more precise. At very high rates (20%+), the Rule of 69.3 gives better estimates. For exact calculations, use the formula: Years = ln(2) / ln(1+r).
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">How does inflation affect time value of money calculations?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Inflation erodes purchasing power, making future dollars worth less in real terms. To account for inflation, use the real interest rate (nominal rate minus inflation) rather than nominal rates. If your investment earns 7% but inflation is 3%, your real return is approximately 4%. This is crucial for long-term planning: $1 million in 30 years at 3% inflation has purchasing power equivalent to only $412,000 today. Always consider whether you need nominal values (actual dollars) or real values (inflation-adjusted purchasing power).
            </p>
          </div>
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-base font-medium text-gray-800 mb-2">What is an annuity and how does it relate to TVM?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              An annuity is a series of equal payments at regular intervals—like mortgage payments, retirement income, or lottery payouts. TVM calculations for annuities are more complex than single lump sums because each payment occurs at a different point in time. The present value of an annuity sums the discounted values of all future payments. Ordinary annuities pay at period end (like most loans), while annuities due pay at period start (like rent). Annuity formulas are essential for comparing lump sum versus payment options.
            </p>
          </div>
          <div>
            <h3 className="text-base font-medium text-gray-800 mb-2">How is TVM used in business valuation and investment analysis?</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              TVM forms the basis of discounted cash flow (DCF) analysis, the gold standard for valuing businesses and investments. DCF projects future cash flows, discounts each back to present value, and sums them to determine intrinsic value. Net present value (NPV) compares this sum to investment cost—positive NPV indicates a worthwhile investment. Internal rate of return (IRR) finds the discount rate that makes NPV zero, useful for comparing investments of different sizes. Bond pricing, stock valuation, and capital budgeting all rely on TVM principles.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="time-value-money-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
