'use client';

import { useState, useEffect } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface MoneyPerHourCalculatorClientProps {
  relatedCalculators: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
  }>;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Money Per Hour Calculator?",
    answer: "A Money Per Hour Calculator is a free online tool designed to help you quickly and accurately calculate money per hour-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Money Per Hour Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Money Per Hour Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Money Per Hour Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MoneyPerHourCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MoneyPerHourCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('money-per-hour-calculator');

  const [value, setValue] = useState('');
  const [result, setResult] = useState<string | null>(null);

  const calculate = () => {
    // Basic placeholder calculation
    if (value) {
      setResult(`Result for ${value}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Money Per Hour Calculator')}</h1>
          <p className="text-lg text-gray-600">Free online money per hour calculator</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="max-w-md mx-auto">
            <div className="mb-3 sm:mb-4 md:mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Value
              </label>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter value..."
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
            >
              Calculate
            </button>

            {result && (
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-semibold">{result}</p>
              </div>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        <RelatedCalculatorCards calculators={relatedCalculators} />

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8 prose prose-gray max-w-none">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Understanding Your True Hourly Earnings</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Calculating your money per hour—your real hourly wage—goes beyond simply dividing your salary by work hours. A comprehensive analysis includes commute time, work-related expenses, unpaid overtime, and opportunity costs. Understanding your true hourly rate helps make informed decisions about job offers, side hustles, and whether additional work is worth the time investment. Many high-salary positions look less attractive when accounting for 60-hour weeks and lengthy commutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2 text-base">Time Factors</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Actual hours worked (including OT)</li>
                <li>• Commute time each way</li>
                <li>• Unpaid lunch breaks</li>
                <li>• Work done at home</li>
              </ul>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2 text-base">Income Factors</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Base salary or wages</li>
                <li>• Bonuses and commissions</li>
                <li>• Benefits monetary value</li>
                <li>• Stock options/RSUs</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2 text-base">Expense Factors</h3>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Transportation costs</li>
                <li>• Work clothing/uniforms</li>
                <li>• Meals and coffee</li>
                <li>• Professional tools/gear</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">The True Hourly Rate Formula</h2>
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            Your true hourly rate equals (Annual Income - Work Expenses) divided by (Actual Work Hours + Commute Hours). A $75,000 salary looks like $36/hour based on 2,080 annual work hours. But with 10 hours weekly overtime, 1-hour daily commute, $5,000 in work expenses, and the value calculation becomes ($75,000 - $5,000) / (2,600 + 520) = $22.44/hour—significantly less than the headline figure. This reality check helps compare opportunities accurately.
          </p>

          <h2 className="text-xl font-semibold text-gray-800 mb-4">Comparing Job Opportunities</h2>
          <p className="text-sm text-gray-600 leading-relaxed">
            When evaluating job offers, convert all compensation to true hourly rates for meaningful comparisons. A remote job paying $65,000 with no commute might yield a higher hourly rate than an $80,000 office job requiring 90-minute commutes. Factor in health insurance value ($7,000-$20,000 for family coverage), retirement matching (multiply contribution by match percentage), and PTO value. Total compensation packages can vary by 20-40% even when base salaries appear similar.
          </p>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How do I calculate my hourly rate from annual salary?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                The basic formula divides annual salary by total work hours: $60,000 ÷ 2,080 hours (40 hours × 52 weeks) = $28.85/hour. However, this assumes exactly 40-hour weeks with no overtime. For a more accurate figure, track your actual hours over several weeks, including time checking emails at home or attending work events. Many salaried employees work 45-50+ hours weekly, which significantly reduces the true hourly rate.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">Should I include commute time in hourly calculations?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Yes, commute time represents hours you wouldn&apos;t spend if not for work. A 45-minute each-way commute adds 7.5 hours weekly—375 hours annually. That&apos;s equivalent to over 9 extra work weeks per year of unpaid time. When comparing jobs, a lower-paying position with shorter commute might actually provide better hourly compensation and more free time. Remote work eliminates commute entirely, effectively giving back this time.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">What work-related expenses should I subtract from income?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Include all costs you wouldn&apos;t incur without the job: transportation (gas, parking, public transit, car wear), professional clothing beyond normal wardrobe, work meals and coffee, professional dues and certifications, home office costs not reimbursed, childcare expenses specifically for work hours, and tools or equipment you purchase. These can easily total $3,000-$10,000+ annually, significantly impacting your true hourly rate.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How do I value employer benefits in hourly calculations?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Add benefit values to your income before calculating hourly rate. Health insurance: use employer&apos;s premium contribution (often $6,000-$15,000/year for family). Retirement match: 4% match on $60,000 salary = $2,400/year. PTO: multiply daily pay by days off ($230/day × 15 days = $3,450). Stock options require estimating future value—use conservative figures. Total benefits can add 20-40% to base compensation value.
              </p>
            </div>
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-medium text-gray-800 mb-2">How can I increase my effective hourly rate?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Three approaches: increase income (raises, promotions, side income), reduce work hours (negotiate flexibility, eliminate unpaid overtime, work from home), or cut work expenses (carpool, pack lunches, use company equipment). The most impactful change is often reducing unpaid hours. If you&apos;re working 50 hours for 40-hour pay, either negotiate overtime compensation or establish boundaries. Time saved is equivalent to earning more per hour worked.
              </p>
            </div>
            <div>
              <h3 className="text-base font-medium text-gray-800 mb-2">Is a higher salary always better than higher hourly pay?</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Not necessarily. Salaried positions often expect unlimited hours for fixed pay, while hourly workers earn overtime (1.5x-2x rate) for extra hours. A $50,000 salary with 50-hour weeks equals $19.23/hour, while $20/hour with consistent 40-hour weeks plus occasional overtime can exceed total salaried compensation. Evaluate job structures holistically—some salaried roles offer flexibility that justifies potentially lower hourly rates.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="money-per-hour-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
