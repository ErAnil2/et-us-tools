'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "How do you calculate annual salary from an hourly wage?",
    answer: "To convert hourly wage to annual salary, multiply your hourly rate by the number of hours you work per week, then multiply that by 52 weeks. The standard calculation assumes 40 hours per week: Annual Salary = Hourly Rate × 40 hours × 52 weeks = Hourly Rate × 2,080 hours. For example, $20/hour × 2,080 hours = $41,600 annual salary. This calculation assumes full-time employment with 52 weeks per year and no unpaid time off.",
    order: 1
  },
  {
    id: '2',
    question: "Is the $20 an hour annual salary before or after taxes?",
    answer: "The calculated annual salary from an hourly wage represents your gross income before any deductions. When you calculate $20/hour × 2,080 hours = $41,600, that's your pre-tax earnings. Your actual take-home pay (net income) will be significantly less after federal income tax, state income tax, Social Security (6.2%), Medicare (1.45%), and any other deductions like health insurance or retirement contributions. Typical take-home pay is approximately 70-80% of gross salary, depending on your tax bracket, deductions, and state of residence.",
    order: 2
  },
  {
    id: '3',
    question: "What is the hourly rate for a $60,000 salary?",
    answer: "To convert annual salary to hourly rate, divide the annual salary by the number of working hours in a year. For standard full-time employment (40 hours/week, 52 weeks/year = 2,080 hours): $60,000 ÷ 2,080 hours = $28.85/hour. This calculation assumes you're paid for every week of the year. If you have unpaid time off, the effective hourly rate would be slightly lower. For example, with 2 weeks unpaid vacation, you'd work 2,000 hours: $60,000 ÷ 2,000 = $30/hour.",
    order: 3
  },
  {
    id: '4',
    question: "How many hours is considered full-time employment?",
    answer: "Full-time employment is typically defined as 40 hours per week in the United States, though the exact definition can vary by employer and industry. The Fair Labor Standards Act (FLSA) doesn't specifically define full-time employment, but 40 hours/week has become the standard. Some employers consider 35-37.5 hours as full-time. For benefits purposes, the Affordable Care Act defines full-time as an average of 30 hours per week or 130 hours per month. Part-time employment is generally anything less than 35 hours per week.",
    order: 4
  },
  {
    id: '5',
    question: "Should I negotiate hourly wage or annual salary?",
    answer: "Whether to negotiate hourly wage or annual salary depends on your employment situation and which structure gives you better clarity and leverage. Hourly positions offer transparency—you get paid for every hour worked, including overtime (typically 1.5× rate for hours over 40/week)—making it easier to track earnings and ensuring compensation for extra work. This structure benefits those with variable schedules or overtime potential. Salary positions provide income stability with consistent paychecks regardless of hours worked, often come with better benefits, and may offer more professional advancement opportunities. However, salaried employees classified as 'exempt' don't receive overtime pay, so working 50-60 hours provides no additional compensation. When negotiating, calculate both perspectives: if offered $50,000 salary, that's $24/hour (÷ 2,080 hours), but only $20/hour if you regularly work 50-hour weeks (50 hours × 52 weeks = 2,600 hours). Always consider total compensation including benefits, PTO, retirement contributions, and expected work hours.",
    order: 5
  },
  {
    id: '6',
    question: "How do paid time off and holidays affect annual salary calculations?",
    answer: "Paid time off (PTO) and holidays don't affect your annual salary calculation for salaried employees—you receive the same annual amount regardless of days off. However, for hourly workers, PTO significantly impacts earnings. If you're hourly and take unpaid time off, your actual annual earnings decrease. Example: At $25/hour with 2 weeks unpaid vacation, you work only 50 weeks (2,000 hours instead of 2,080), earning $50,000 instead of $52,000. Most full-time positions offer paid holidays (typically 6-10 days) and PTO (10-20 days), meaning you're paid even when not working. When comparing job offers, always consider total compensation: a $50,000 salary with 3 weeks PTO (15 days) plus 10 holidays provides more value than $52,000 with no benefits, as you'd need to work every day to earn that higher amount.",
    order: 6
  }
];

export default function HourlyToAnnualSalaryCalculatorClient() {
  const [hourlyRate, setHourlyRate] = useState(25);
  const [hoursPerWeek, setHoursPerWeek] = useState(40);
  const [results, setResults] = useState<any>(null);

  const calculateSalary = () => {
    const annualSalary = hourlyRate * hoursPerWeek * 52;
    const monthlySalary = annualSalary / 12;
    const weeklySalary = hourlyRate * hoursPerWeek;
    const dailySalary = weeklySalary / 5;

    // Overtime calculations (assuming standard 40hr/week, time-and-a-half after)
    const regularHours = Math.min(hoursPerWeek, 40);
    const overtimeHours = Math.max(0, hoursPerWeek - 40);
    const regularPay = regularHours * hourlyRate * 52;
    const overtimePay = overtimeHours * hourlyRate * 1.5 * 52;
    const totalWithOT = regularPay + overtimePay;

    // Tax estimates (rough approximation)
    const federalTax = annualSalary * 0.15;
    const ficaTax = annualSalary * 0.0765;
    const stateTax = annualSalary * 0.05;
    const totalTax = federalTax + ficaTax + stateTax;
    const takeHome = annualSalary - totalTax;

    setResults({
      annualSalary: Math.round(annualSalary),
      monthlySalary: Math.round(monthlySalary),
      weeklySalary: Math.round(weeklySalary),
      dailySalary: Math.round(dailySalary),
      totalWithOT: Math.round(totalWithOT),
      overtimeAmount: Math.round(overtimePay),
      hasOvertime: overtimeHours > 0,
      federalTax: Math.round(federalTax),
      ficaTax: Math.round(ficaTax),
      stateTax: Math.round(stateTax),
      totalTax: Math.round(totalTax),
      takeHome: Math.round(takeHome),
      takeHomeMonthly: Math.round(takeHome / 12)
    });
  };

  useEffect(() => {
    if (hourlyRate > 0 && hoursPerWeek > 0) {
      calculateSalary();
    }
  }, [hourlyRate, hoursPerWeek]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Hourly to Annual Salary Calculator</h1>
        <p className="text-lg text-gray-600">Convert your hourly wage to annual, monthly, weekly, and daily salary</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Enter Your Rate</h2>

          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hourly Rate ($)</label>
              <input
                type="number"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="0"
                step="0.25"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                value={hourlyRate}
                onChange={(e) => setHourlyRate(Number(e.target.value))}
                min="7.25"
                max="150"
                step="0.25"
                className="w-full mt-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hours Per Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                min="1"
                max="80"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="range"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                min="1"
                max="80"
                className="w-full mt-2"
              />
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Quick Reference</h4>
              <div className="text-sm text-blue-700 space-y-1">
                <p>Full-time: 40 hours/week</p>
                <p>Part-time: 20-35 hours/week</p>
                <p>Federal minimum wage: $7.25/hr</p>
              </div>
            </div>
          </div>
        </div>

        {results && (
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Salary Breakdown</h3>

              <div className="space-y-4">
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <div className="text-sm text-green-700">Annual Salary</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">${results.annualSalary.toLocaleString()}</div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-blue-700">Monthly</div>
                    <div className="text-xl font-bold text-blue-600">${results.monthlySalary.toLocaleString()}</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-sm text-purple-700">Weekly</div>
                    <div className="text-xl font-bold text-purple-600">${results.weeklySalary.toLocaleString()}</div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm text-gray-600 mb-2">Daily Salary (5 days/week)</div>
                  <div className="text-xl font-semibold text-gray-800">${results.dailySalary.toLocaleString()}</div>
                </div>

                {results.hasOvertime && (
                  <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                    <h4 className="font-semibold text-orange-800 mb-2">With Overtime Pay</h4>
                    <div className="text-2xl font-bold text-orange-600 mb-1">
                      ${results.totalWithOT.toLocaleString()}/year
                    </div>
                    <div className="text-sm text-orange-700">
                      +${results.overtimeAmount.toLocaleString()} overtime premium
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Estimated Take-Home Pay</h3>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Gross Annual Salary</span>
                  <span className="font-semibold">${results.annualSalary.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Federal Tax (est. 15%)</span>
                  <span className="text-red-600">-${results.federalTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">FICA (7.65%)</span>
                  <span className="text-red-600">-${results.ficaTax.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">State Tax (est. 5%)</span>
                  <span className="text-red-600">-${results.stateTax.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex justify-between">
                  <span className="font-semibold text-gray-800">Net Annual Income</span>
                  <span className="font-bold text-green-600">${results.takeHome.toLocaleString()}</span>
                </div>
                <div className="text-center bg-green-50 rounded-lg p-3">
                  <div className="text-sm text-green-700">Monthly Take-Home</div>
                  <div className="text-xl font-bold text-green-600">${results.takeHomeMonthly.toLocaleString()}</div>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-3">
                *Tax estimates are approximate and vary by state, filing status, and deductions
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mt-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Salary Calculators</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { href: "/us/tools/calculators/salary-calculator", title: "Salary Calculator", description: "Calculate take-home pay", color: "bg-blue-500" },
            { href: "/us/tools/calculators/paycheck-calculator", title: "Paycheck Calculator", description: "Estimate net paycheck", color: "bg-green-500" },
            { href: "/us/tools/calculators/tax-calculator", title: "Tax Calculator", description: "Calculate income tax", color: "bg-red-500" },
            { href: "/us/tools/calculators/retirement-calculator", title: "Retirement Calculator", description: "Plan retirement savings", color: "bg-purple-500" },
          ].map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="bg-white border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className={`w-10 h-10 ${calc.color} rounded-lg flex items-center justify-center mb-3`}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 text-sm group-hover:text-blue-600 transition-colors mb-1">{calc.title}</h3>
                <p className="text-xs text-gray-500">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Understanding Hourly to Annual Salary Conversion</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Converting hourly wages to annual salary helps you understand your total earning potential and compare job offers. Whether you&apos;re an hourly worker considering a salaried position, or evaluating the true value of different employment opportunities, knowing how to accurately calculate annual compensation from hourly rates is essential for financial planning and career decisions.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">Standard Calculation</h3>
            <p className="text-xs text-gray-600">
              The standard formula multiplies hourly rate by 2,080 hours (40 hours/week × 52 weeks). This assumes full-time employment with no unpaid time off.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Consider Benefits</h3>
            <p className="text-xs text-gray-600">
              When comparing positions, factor in health insurance, PTO, retirement matching, and other benefits that affect total compensation.
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Tax Implications</h3>
            <p className="text-xs text-gray-600">
              Remember that your take-home pay will be less than gross salary after federal, state, FICA taxes, and other deductions.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <FirebaseFAQs pageId="hourly-to-annual-salary-calculator" fallbackFaqs={fallbackFaqs} />

      {/* Disclaimer */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-2xl">⚠️</div>
          <div>
            <h3 className="text-sm font-semibold text-amber-800 mb-1">Important Note</h3>
            <p className="text-xs sm:text-sm text-amber-700">
              This calculator provides estimates based on standard calculations and average tax rates. Actual take-home pay varies based on your specific tax situation, state of residence, filing status, deductions, and employer benefits. Consult with a tax professional or financial advisor for personalized advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
