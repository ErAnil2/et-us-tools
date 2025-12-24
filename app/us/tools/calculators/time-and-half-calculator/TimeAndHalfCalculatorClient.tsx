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
    question: "What is a Time And Half Calculator?",
    answer: "A Time And Half Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function TimeAndHalfCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('time-and-half-calculator');

  const [regularHourlyRate, setRegularHourlyRate] = useState<number>(25);
  const [overtimeRateMultiplier, setOvertimeRateMultiplier] = useState<string>('1.5');
  const [customRate, setCustomRate] = useState<number>(1.75);
  const [regularHours, setRegularHours] = useState<number>(40);
  const [overtimeHours, setOvertimeHours] = useState<number>(8);
  const [doubleTimeHours, setDoubleTimeHours] = useState<number>(0);
  const [taxRate, setTaxRate] = useState<number>(0);
  const [otherDeductions, setOtherDeductions] = useState<number>(0);
  const [useTotalHours, setUseTotalHours] = useState<boolean>(false);
  const [weeklyTotalHours, setWeeklyTotalHours] = useState<number>(50);
  const [overtimeThreshold, setOvertimeThreshold] = useState<string>('40');

  // Results
  const [results, setResults] = useState({
    regularPay: 1000,
    overtimePayAmount: 300,
    doubleTimePay: 0,
    totalGrossPay: 1300,
    totalHours: 48,
    effectiveRate: 27.08,
    overtimeRate: 37.5,
    doubleTimeRate: 50,
    taxes: 0,
    netPay: 1300
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateOvertimePay = () => {
    if (!regularHourlyRate || regularHourlyRate <= 0) {
      return;
    }

    let calcRegularHours: number;
    let calcOvertimeHours: number;
    let calcDoubleTimeHours: number;

    if (useTotalHours) {
      const threshold = parseFloat(overtimeThreshold) || 40;
      calcRegularHours = Math.min(weeklyTotalHours, threshold);
      calcOvertimeHours = Math.max(0, weeklyTotalHours - threshold);
      calcDoubleTimeHours = 0;
    } else {
      calcRegularHours = regularHours || 0;
      calcOvertimeHours = overtimeHours || 0;
      calcDoubleTimeHours = doubleTimeHours || 0;
    }

    // Determine overtime multiplier
    let overtimeMultiplier: number;
    if (overtimeRateMultiplier === 'custom') {
      overtimeMultiplier = customRate || 1.5;
    } else {
      overtimeMultiplier = parseFloat(overtimeRateMultiplier);
    }

    // Calculate pay components
    const regularPay = calcRegularHours * regularHourlyRate;
    const overtimeRate = regularHourlyRate * overtimeMultiplier;
    const overtimePayAmount = calcOvertimeHours * overtimeRate;
    const doubleTimeRate = regularHourlyRate * 2;
    const doubleTimePay = calcDoubleTimeHours * doubleTimeRate;

    const totalGrossPay = regularPay + overtimePayAmount + doubleTimePay;
    const totalHours = calcRegularHours + calcOvertimeHours + calcDoubleTimeHours;
    const effectiveRate = totalHours > 0 ? totalGrossPay / totalHours : 0;

    // Calculate deductions
    const taxes = totalGrossPay * (taxRate / 100);
    const netPay = totalGrossPay - taxes - otherDeductions;

    setResults({
      regularPay,
      overtimePayAmount,
      doubleTimePay,
      totalGrossPay,
      totalHours,
      effectiveRate,
      overtimeRate,
      doubleTimeRate,
      taxes,
      netPay
    });
  };

  useEffect(() => {
    calculateOvertimePay();
  }, [regularHourlyRate, overtimeRateMultiplier, customRate, regularHours, overtimeHours, doubleTimeHours, taxRate, otherDeductions, useTotalHours, weeklyTotalHours, overtimeThreshold]);

  const totalHoursWorked = regularHours + overtimeHours + doubleTimeHours;

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">{getH1('Time and Half Calculator Online')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate your overtime pay at time and half rates. Determine total weekly pay with regular and overtime hours.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Overtime Pay Calculator</h2>

            <form className="space-y-3 sm:space-y-4 md:space-y-6" onSubmit={(e) => e.preventDefault()}>
              {/* Basic Pay Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Basic Pay Information</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="regular-hourly-rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Hourly Rate ($)
                    </label>
                    <input
                      type="number"
                      id="regular-hourly-rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="25.00"
                      min={7.25}
                      max={200}
                      step={0.01}
                      value={regularHourlyRate}
                      onChange={(e) => setRegularHourlyRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label htmlFor="overtime-rate-multiplier" className="block text-sm font-medium text-gray-700 mb-1">
                      Overtime Rate Multiplier
                    </label>
                    <select
                      id="overtime-rate-multiplier"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={overtimeRateMultiplier}
                      onChange={(e) => setOvertimeRateMultiplier(e.target.value)}
                    >
                      <option value="1.5">Time and Half (1.5x)</option>
                      <option value="2.0">Double Time (2x)</option>
                      <option value="1.25">Time and Quarter (1.25x)</option>
                      <option value="custom">Custom Rate</option>
                    </select>
                  </div>
                  {overtimeRateMultiplier === 'custom' && (
                    <div>
                      <label htmlFor="custom-rate" className="block text-sm font-medium text-gray-700 mb-1">
                        Custom Multiplier
                      </label>
                      <input
                        type="number"
                        id="custom-rate"
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="1.75"
                        min={1}
                        max={3}
                        step={0.25}
                        value={customRate}
                        onChange={(e) => setCustomRate(parseFloat(e.target.value) || 1.5)}
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Hours Worked */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Hours Worked</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="regular-hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Regular Hours (up to 40)
                    </label>
                    <input
                      type="number"
                      id="regular-hours"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="40"
                      min={0}
                      max={40}
                      step={0.25}
                      value={regularHours}
                      onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label htmlFor="overtime-hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Overtime Hours (over 40)
                    </label>
                    <input
                      type="number"
                      id="overtime-hours"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="10"
                      min={0}
                      max={80}
                      step={0.25}
                      value={overtimeHours}
                      onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label htmlFor="double-time-hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Double Time Hours (Optional)
                    </label>
                    <input
                      type="number"
                      id="double-time-hours"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min={0}
                      max={40}
                      step={0.25}
                      value={doubleTimeHours}
                      onChange={(e) => setDoubleTimeHours(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Some states require double time for excessive hours</p>
                  </div>
                  <div>
                    <label htmlFor="total-hours" className="block text-sm font-medium text-gray-700 mb-1">
                      Total Hours Worked
                    </label>
                    <input
                      type="number"
                      id="total-hours"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50"
                      readOnly
                      value={totalHoursWorked.toFixed(2)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Automatically calculated</p>
                  </div>
                </div>
              </div>

              {/* Alternative Input Method */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold mb-4">Alternative: Total Hours Entry</h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center mb-3">
                    <input
                      type="checkbox"
                      id="use-total-hours"
                      className="mr-3"
                      checked={useTotalHours}
                      onChange={(e) => setUseTotalHours(e.target.checked)}
                    />
                    <label htmlFor="use-total-hours" className="text-sm font-medium">
                      Enter total hours worked (automatically calculate overtime)
                    </label>
                  </div>
                  {useTotalHours && (
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="weekly-total-hours" className="block text-sm font-medium text-gray-700 mb-1">
                          Total Hours This Week
                        </label>
                        <input
                          type="number"
                          id="weekly-total-hours"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="50"
                          min={0}
                          max={120}
                          step={0.25}
                          value={weeklyTotalHours}
                          onChange={(e) => setWeeklyTotalHours(parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <label htmlFor="overtime-threshold" className="block text-sm font-medium text-gray-700 mb-1">
                          Overtime Starts After
                        </label>
                        <select
                          id="overtime-threshold"
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                          value={overtimeThreshold}
                          onChange={(e) => setOvertimeThreshold(e.target.value)}
                        >
                          <option value="40">40 hours (Federal)</option>
                          <option value="8">8 hours daily (CA, AK, NV)</option>
                          <option value="38">38 hours</option>
                          <option value="44">44 hours</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Deductions (Optional)</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tax-rate" className="block text-sm font-medium text-gray-700 mb-1">
                      Tax Rate (%)
                    </label>
                    <input
                      type="number"
                      id="tax-rate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="22"
                      min={0}
                      max={50}
                      step={0.1}
                      value={taxRate || ''}
                      onChange={(e) => setTaxRate(parseFloat(e.target.value) || 0)}
                    />
                  </div>
                  <div>
                    <label htmlFor="other-deductions" className="block text-sm font-medium text-gray-700 mb-1">
                      Other Deductions ($)
                    </label>
                    <input
                      type="number"
                      id="other-deductions"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="0"
                      min={0}
                      step={0.01}
                      value={otherDeductions || ''}
                      onChange={(e) => setOtherDeductions(parseFloat(e.target.value) || 0)}
                    />
                    <p className="text-xs text-gray-500 mt-1">Insurance, 401k, union dues, etc.</p>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-3 sm:px-4 md:px-6 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                onClick={calculateOvertimePay}
              >
                Calculate Overtime Pay
              </button>
            </form>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        <div className="lg:col-span-1">
          {/* Pay Results */}
          <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Pay Breakdown</h3>

            <div className="space-y-4">
              <div className="text-center mb-3 sm:mb-4 md:mb-6">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{formatCurrency(results.totalGrossPay)}</div>
                <div className="text-sm text-gray-600">Total Gross Pay</div>
              </div>

              <div className="space-y-3">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Regular Pay</span>
                    <span className="text-blue-600 font-bold">{formatCurrency(results.regularPay)}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {useTotalHours ? Math.min(weeklyTotalHours, parseFloat(overtimeThreshold)).toFixed(2) : regularHours.toFixed(2)} hrs × {formatCurrency(regularHourlyRate)}/hr
                  </div>
                </div>

                <div className="bg-green-50 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-sm">Overtime Pay</span>
                    <span className="text-green-600 font-bold">{formatCurrency(results.overtimePayAmount)}</span>
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {useTotalHours ? Math.max(0, weeklyTotalHours - parseFloat(overtimeThreshold)).toFixed(2) : overtimeHours.toFixed(2)} hrs × {formatCurrency(results.overtimeRate)}/hr
                  </div>
                </div>

                {doubleTimeHours > 0 && (
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-sm">Double Time Pay</span>
                      <span className="text-purple-600 font-bold">{formatCurrency(results.doubleTimePay)}</span>
                    </div>
                    <div className="text-xs text-gray-600 mt-1">
                      {doubleTimeHours.toFixed(2)} hrs × {formatCurrency(results.doubleTimeRate)}/hr
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h5 className="font-semibold mb-3">Total Hours Summary</h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Regular Hours:</span>
                    <span className="font-medium">{useTotalHours ? Math.min(weeklyTotalHours, parseFloat(overtimeThreshold)).toFixed(2) : regularHours.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime Hours:</span>
                    <span className="font-medium">{useTotalHours ? Math.max(0, weeklyTotalHours - parseFloat(overtimeThreshold)).toFixed(2) : overtimeHours.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Hours:</span>
                    <span className="font-medium">{results.totalHours.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Effective Hourly Rate:</span>
                    <span className="font-medium">{formatCurrency(results.effectiveRate)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Net Pay */}
          {(results.taxes > 0 || otherDeductions > 0) && (
            <div className="bg-white rounded-lg shadow-md p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h4 className="text-md font-bold text-gray-900 mb-4">Net Pay (After Deductions)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Pay:</span>
                  <span>{formatCurrency(results.totalGrossPay)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Taxes:</span>
                  <span className="text-red-600">-{formatCurrency(results.taxes)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Other Deductions:</span>
                  <span className="text-red-600">-{formatCurrency(otherDeductions)}</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-medium">
                    <span>Net Pay:</span>
                    <span className="text-green-600">{formatCurrency(results.netPay)}</span>
                  </div>
                </div>
              </div>
            </div>
)}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="time-and-half-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* SEO Content */}
      <section className="bg-white rounded-lg shadow-sm p-3 sm:p-5 md:p-8 mt-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Overtime Pay</h2>
        <p className="text-gray-700 leading-relaxed mb-3 sm:mb-4 md:mb-6">
          Overtime pay compensates employees for working more than standard hours. In the United States,
          federal law requires most employees to receive time and half pay (1.5x regular rate) for hours worked over 40 in a workweek.
        </p>

        <h3 className="text-xl font-bold text-gray-900 mb-4">Federal Overtime Laws (FLSA)</h3>
        <ul className="list-disc pl-6 mb-3 sm:mb-4 md:mb-6 space-y-2 text-gray-700">
          <li><strong>40-Hour Rule:</strong> Overtime required for non-exempt employees working over 40 hours per week</li>
          <li><strong>Time and Half Rate:</strong> Overtime pay must be at least 1.5 times the regular rate</li>
          <li><strong>Weekly Basis:</strong> Overtime calculated on a workweek basis, not daily</li>
          <li><strong>No Daily Overtime:</strong> Federal law doesn&apos;t require overtime for long days under 40 hours/week</li>
          <li><strong>Exempt vs Non-Exempt:</strong> Some employees (executives, professionals) may be exempt</li>
        </ul>

        <h3 className="text-xl font-bold text-gray-900 mb-4">State Overtime Laws</h3>
        <ul className="list-disc pl-6 mb-3 sm:mb-4 md:mb-6 space-y-2 text-gray-700">
          <li><strong>California:</strong> Overtime after 8 hours per day or 40 hours per week</li>
          <li><strong>Alaska:</strong> Overtime after 8 hours per day</li>
          <li><strong>Nevada:</strong> Overtime after 8 hours per day (if earning less than 1.5x minimum wage)</li>
          <li><strong>Double Time:</strong> Some states require double pay for excessive hours (12+ hours/day)</li>
          <li><strong>Seventh Day Rule:</strong> Some states require overtime for seventh consecutive workday</li>
        </ul>
      </section>

      {/* MREC Banners */}
{/* Related Calculators */}
      <section className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className={`${calc.color} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}
            >
              <h3 className="font-semibold">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
