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

const fallbackFaqs = [
  {
    id: '1',
    question: "How is overtime pay calculated?",
    answer: "Overtime pay is calculated by multiplying your regular hourly rate by the overtime multiplier (typically 1.5x) for all hours worked beyond 40 in a week. For example, if you earn $20/hour and work 45 hours, you get $20×40 = $800 regular pay plus $20×1.5×5 = $150 overtime pay, totaling $950.",
    order: 1
  },
  {
    id: '2',
    question: "When does overtime start?",
    answer: "Under federal law (FLSA), overtime starts after 40 hours worked in a workweek. Some states like California require daily overtime after 8 hours in a day. Always check your state's specific rules as they may be more generous than federal requirements.",
    order: 2
  },
  {
    id: '3',
    question: "What is double time pay?",
    answer: "Double time pay means earning twice your regular hourly rate. It's required in some states (like California) after 12 hours in a day, on the 7th consecutive work day, or on holidays. Not all employers or states require double time pay.",
    order: 3
  },
  {
    id: '4',
    question: "Are salaried employees eligible for overtime?",
    answer: "It depends on whether you're classified as 'exempt' or 'non-exempt.' Non-exempt salaried employees are entitled to overtime. Exempt employees typically include executives, professionals, and administrative workers earning above a certain salary threshold (currently $35,568/year federally).",
    order: 4
  },
  {
    id: '5',
    question: "Does overtime pay get taxed more?",
    answer: "Overtime pay is taxed at the same rate as regular income. However, higher total earnings may push you into a higher tax bracket, making it seem like overtime is taxed more. The increased withholding is an estimate that gets reconciled when you file your tax return.",
    order: 5
  },
  {
    id: '6',
    question: "Can my employer refuse to pay overtime?",
    answer: "If you're a non-exempt employee, your employer must pay overtime as required by law. However, employers can limit overtime by adjusting schedules. Refusing to pay legally owed overtime is a violation of the FLSA and can result in penalties and back pay requirements.",
    order: 6
  }
];

export default function OvertimeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('overtime-calculator');

  const [regularHours, setRegularHours] = useState(40);
  const [overtimeHours, setOvertimeHours] = useState(5);
  const [doubleTimeHours, setDoubleTimeHours] = useState(0);
  const [hourlyRate, setHourlyRate] = useState(20);
  const [overtimeRate, setOvertimeRate] = useState(1.5);
  const [doubleTimeRate, setDoubleTimeRate] = useState(2);

  const [regularPay, setRegularPay] = useState(800);
  const [overtimePay, setOvertimePay] = useState(150);
  const [doubleTimePay, setDoubleTimePay] = useState(0);
  const [totalPay, setTotalPay] = useState(950);
  const [recommendation, setRecommendation] = useState('Track your hours carefully to ensure accurate overtime pay.');

  useEffect(() => {
    calculateOvertime();
  }, [regularHours, overtimeHours, doubleTimeHours, hourlyRate, overtimeRate, doubleTimeRate]);

  const calculateOvertime = () => {
    const regPay = regularHours * hourlyRate;
    const otPay = overtimeHours * (hourlyRate * overtimeRate);
    const dtPay = doubleTimeHours * (hourlyRate * doubleTimeRate);
    const total = regPay + otPay + dtPay;
    const totalHours = regularHours + overtimeHours + doubleTimeHours;

    setRegularPay(regPay);
    setOvertimePay(otPay);
    setDoubleTimePay(dtPay);
    setTotalPay(total);

    if (totalHours > 60) {
      setRecommendation('Consider work-life balance with high overtime hours.');
    } else if (overtimeHours > 20) {
      setRecommendation('High overtime hours. Review staffing needs.');
    } else if (doubleTimeHours > 0) {
      setRecommendation('Double time hours can significantly impact labor costs.');
    } else {
      setRecommendation('Track your hours carefully to ensure accurate overtime pay.');
    }
  };

  return (
    <div className="max-w-[1180px] mx-auto px-4 py-4 sm:py-6 md:py-8">
      {/* Schema.org JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "Overtime Calculator",
          "description": "Calculate overtime pay, double time, and total earnings. Understand FLSA overtime rules and state-specific regulations.",
          "url": "https://economictimes.indiatimes.com/us/tools/calculators/overtime-calculator",
          "applicationCategory": "FinanceApplication",
          "operatingSystem": "Any",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD"
          }
        })
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": fallbackFaqs.map(faq => ({
            "@type": "Question",
            "name": faq.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": faq.answer
            }
          }))
        })
      }} />

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">Overtime Calculator</span>
      </div>

      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Overtime Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Calculate overtime pay and total earnings with accurate calculations for regular, overtime, and double time hours.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Regular Hours */}
              <div>
                <label htmlFor="regularHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Hours
                </label>
                <input
                  type="number"
                  id="regularHours"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={regularHours}
                  onChange={(e) => setRegularHours(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="168"
                  step="0.5"
                />
              </div>

              {/* Overtime Hours */}
              <div>
                <label htmlFor="overtimeHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Overtime Hours (1.5x)
                </label>
                <input
                  type="number"
                  id="overtimeHours"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={overtimeHours}
                  onChange={(e) => setOvertimeHours(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="168"
                  step="0.5"
                />
              </div>

              {/* Double Time Hours */}
              <div>
                <label htmlFor="doubleTimeHours" className="block text-sm font-medium text-gray-700 mb-2">
                  Double Time Hours (2x)
                </label>
                <input
                  type="number"
                  id="doubleTimeHours"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={doubleTimeHours}
                  onChange={(e) => setDoubleTimeHours(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="168"
                  step="0.5"
                />
              </div>

              {/* Hourly Rate */}
              <div>
                <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                  Regular Hourly Rate ($)
                </label>
                <input
                  type="number"
                  id="hourlyRate"
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={hourlyRate}
                  onChange={(e) => setHourlyRate(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.25"
                />
              </div>

              {/* Multipliers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="overtimeRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Overtime Multiplier
                  </label>
                  <input
                    type="number"
                    id="overtimeRate"
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={overtimeRate}
                    onChange={(e) => setOvertimeRate(parseFloat(e.target.value) || 1.5)}
                    min="1"
                    max="3"
                    step="0.1"
                  />
                </div>
                <div>
                  <label htmlFor="doubleTimeRate" className="block text-sm font-medium text-gray-700 mb-2">
                    Double Time Multiplier
                  </label>
                  <input
                    type="number"
                    id="doubleTimeRate"
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={doubleTimeRate}
                    onChange={(e) => setDoubleTimeRate(parseFloat(e.target.value) || 2)}
                    min="1"
                    max="3"
                    step="0.1"
                  />
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Results */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pay Breakdown</h3>

            {/* Total Pay */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-4 border border-green-200">
              <div className="text-sm text-green-600 mb-1">Total Pay</div>
              <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-700">
                ${totalPay.toFixed(2)}
              </div>
            </div>

            {/* Pay Details */}
            <div className="space-y-3 mb-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500">Regular Pay</div>
                  <div className="text-xs text-gray-400">{regularHours}h × ${hourlyRate.toFixed(2)}</div>
                </div>
                <div className="text-lg font-semibold text-gray-800">${regularPay.toFixed(2)}</div>
              </div>

              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div>
                  <div className="text-sm text-orange-600">Overtime Pay ({overtimeRate}x)</div>
                  <div className="text-xs text-orange-400">{overtimeHours}h × ${(hourlyRate * overtimeRate).toFixed(2)}</div>
                </div>
                <div className="text-lg font-semibold text-orange-600">${overtimePay.toFixed(2)}</div>
              </div>

              {doubleTimeHours > 0 && (
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <div>
                    <div className="text-sm text-purple-600">Double Time ({doubleTimeRate}x)</div>
                    <div className="text-xs text-purple-400">{doubleTimeHours}h × ${(hourlyRate * doubleTimeRate).toFixed(2)}</div>
                  </div>
                  <div className="text-lg font-semibold text-purple-600">${doubleTimePay.toFixed(2)}</div>
                </div>
              )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xl font-bold text-gray-900">{regularHours + overtimeHours + doubleTimeHours}</div>
                <div className="text-xs text-gray-500">Total Hours</div>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg text-center">
                <div className="text-xl font-bold text-blue-600">
                  ${(totalPay / (regularHours + overtimeHours + doubleTimeHours || 1)).toFixed(2)}
                </div>
                <div className="text-xs text-gray-500">Avg Rate/Hour</div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="p-3 bg-blue-50 rounded-lg">
              <div className="text-sm text-blue-800">{recommendation}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="overtime-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Business Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">💼</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">{calc.title}</h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
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
              This overtime calculator is for informational purposes only and should not replace professional payroll advice.
              Overtime laws vary by state and industry. Always consult with HR professionals or legal experts for specific
              overtime policies and compliance requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

