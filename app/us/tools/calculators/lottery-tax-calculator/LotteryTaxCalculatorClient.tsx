'use client';

import React, { useState, useEffect } from 'react';
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
    question: "What is a Lottery Tax Calculator?",
    answer: "A Lottery Tax Calculator is a free online tool that helps you calculate and analyze lottery tax-related financial metrics quickly and accurately. It provides instant results to help you make informed financial decisions.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is this Lottery Tax Calculator?",
    answer: "Our Lottery Tax Calculator uses standard financial formulas and provides highly accurate results. However, actual results may vary based on specific terms, conditions, and market factors. Always consult with a financial advisor for major decisions.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Lottery Tax Calculator free to use?",
    answer: "Yes, this Lottery Tax Calculator is completely free to use. There are no hidden charges or registration required. You can use it as many times as you need.",
    order: 3
  },
  {
    id: '4',
    question: "Can I save my Lottery Tax calculations?",
    answer: "The calculator displays results instantly on screen. You can take a screenshot or note down the results for your records. Some browsers also allow you to print the page.",
    order: 4
  },
  {
    id: '5',
    question: "What information do I need for this calculator?",
    answer: "You'll need basic information related to lottery tax such as amounts, rates, time periods, or other relevant values. The calculator will guide you through each required field.",
    order: 5
  }
];

export default function LotteryTaxCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('lottery-tax-calculator');

  const [winnings, setWinnings] = useState(1000000);
  const [federalTax, setFederalTax] = useState(37);
  const [stateTax, setStateTax] = useState(0);
  const [payoutType, setPayoutType] = useState('lump-sum');
  const [annuityYears, setAnnuityYears] = useState(30);

  const [results, setResults] = useState({
    afterFederalTax: 0,
    afterStateTax: 0,
    totalTax: 0,
    takeHome: 0,
    annualPayment: 0
  });

  useEffect(() => {
    calculateTax();
  }, [winnings, federalTax, stateTax, payoutType, annuityYears]);

  const calculateTax = () => {
    let grossWinnings = Math.max(0, winnings);

    if (payoutType === 'annuity') {
      grossWinnings = grossWinnings / annuityYears;
    }

    const federalTaxAmount = grossWinnings * (federalTax / 100);
    const afterFederal = grossWinnings - federalTaxAmount;

    const stateTaxAmount = grossWinnings * (stateTax / 100);
    const afterState = grossWinnings - federalTaxAmount - stateTaxAmount;

    const totalTaxAmount = federalTaxAmount + stateTaxAmount;

    setResults({
      afterFederalTax: federalTaxAmount,
      afterStateTax: stateTaxAmount,
      totalTax: totalTaxAmount,
      takeHome: afterState,
      annualPayment: payoutType === 'annuity' ? afterState : 0
    });
  };

  const handleTemplate = (amount: number, federal: number, state: number, payout: string) => {
    setWinnings(amount);
    setFederalTax(federal);
    setStateTax(state);
    setPayoutType(payout);
  };

  const handleStateSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setStateTax(value);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Lottery Tax Calculator')}</h1>
        <p className="text-base sm:text-lg text-gray-600">Calculate taxes on lottery winnings including federal and state taxes</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lottery Winnings</h2>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Quick Scenarios</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button type="button" onClick={() => handleTemplate(100000, 37, 0, 'lump-sum')} className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Small Win ($100K)</button>
                <button type="button" onClick={() => handleTemplate(1000000, 37, 0, 'lump-sum')} className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Million Dollar Win</button>
                <button type="button" onClick={() => handleTemplate(10000000, 37, 0, 'lump-sum')} className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">10 Million Win</button>
                <button type="button" onClick={() => handleTemplate(1000000, 37, 13.3, 'lump-sum')} className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">CA Winner ($1M)</button>
                <button type="button" onClick={() => handleTemplate(5000000, 37, 8.82, 'lump-sum')} className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">NY Winner ($5M)</button>
                <button type="button" onClick={() => handleTemplate(10000000, 37, 0, 'annuity')} className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors">Annuity Option</button>
              </div>
            </div>

            <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lottery Winnings Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={winnings}
                    onChange={(e) => setWinnings(parseFloat(e.target.value) || 0)}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="0"
                    step="1000"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payout Type</label>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={payoutType === 'lump-sum'}
                      onChange={() => setPayoutType('lump-sum')}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-sm">Lump Sum Payment</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      checked={payoutType === 'annuity'}
                      onChange={() => setPayoutType('annuity')}
                      className="mr-3 text-blue-600"
                    />
                    <span className="text-sm">Annuity (Annual Payments)</span>
                  </label>
                </div>
              </div>

              {payoutType === 'annuity' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Annuity Duration (Years)</label>
                  <input
                    type="number"
                    value={annuityYears}
                    onChange={(e) => setAnnuityYears(parseInt(e.target.value) || 30)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    min="1"
                    max="30"
                  />
                </div>
              )}
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-700">Tax Information</h4>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Federal Tax Rate (%)</label>
                <input
                  type="number"
                  value={federalTax}
                  onChange={(e) => setFederalTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="45"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Top federal tax bracket: 37%</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Tax Rate (%)</label>
                <input
                  type="number"
                  value={stateTax}
                  onChange={(e) => setStateTax(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min="0"
                  max="15"
                  step="0.1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State Quick Select</label>
                <select
                  onChange={handleStateSelect}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="0">No State Tax</option>
                  <option value="13.3">California (13.3%)</option>
                  <option value="8.82">New York (8.82%)</option>
                  <option value="5.75">Maryland (5.75%)</option>
                  <option value="10.75">New Jersey (10.75%)</option>
                  <option value="5.99">Minnesota (5.99%)</option>
                  <option value="5">North Carolina (5%)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Tax Calculation Results</h3>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-3 sm:p-4 md:p-6 rounded-xl mb-3 sm:mb-4 md:mb-6">
              <div className="text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-800 mb-2">{formatCurrency(results.takeHome)}</div>
                <div className="text-sm text-blue-600 mb-4">
                  {payoutType === 'annuity' ? 'Annual Take-Home (After Taxes)' : 'Total Take-Home (After Taxes)'}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Gross Winnings:</span>
                  <span className="font-semibold">{formatCurrency(payoutType === 'annuity' ? winnings / annuityYears : winnings)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Federal Tax ({federalTax}%):</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(results.afterFederalTax)}</span>
                </div>
                <div className="flex justify-between">
                  <span>State Tax ({stateTax}%):</span>
                  <span className="font-semibold text-red-600">-{formatCurrency(results.afterStateTax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Total Taxes:</span>
                  <span className="text-red-600">-{formatCurrency(results.totalTax)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between font-bold">
                  <span>Your Take-Home:</span>
                  <span className="text-green-600">{formatCurrency(results.takeHome)}</span>
                </div>
              </div>
            </div>

            {payoutType === 'annuity' && (
              <div className="bg-yellow-50 p-4 rounded-xl mb-3 sm:mb-4 md:mb-6">
                <h4 className="text-lg font-semibold text-yellow-800 mb-3">Annuity Details</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Number of Payments:</span>
                    <span className="font-semibold">{annuityYears} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Winnings:</span>
                    <span className="font-semibold">{formatCurrency(winnings)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Payment (Gross):</span>
                    <span className="font-semibold">{formatCurrency(winnings / annuityYears)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Annual Payment (Net):</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.takeHome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Total Take-Home (30 years):</span>
                    <span className="font-semibold text-green-600">{formatCurrency(results.takeHome * annuityYears)}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-xl">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Tax Breakdown by State</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Federal Withholding:</span>
                  <span className="font-semibold">24% upfront</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Federal Tax:</span>
                  <span className="font-semibold">Up to 13% more at filing</span>
                </div>
                <div className="flex justify-between">
                  <span>State Taxes:</span>
                  <span className="font-semibold">Varies (0-13%+)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">Important Disclaimer</h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>This calculator provides estimates for educational purposes only. Actual lottery taxes may vary based on current tax rates, state regulations, and individual circumstances. Consult with a tax professional for accurate calculations.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className={`${calc.color || 'bg-gray-500'} text-white p-4 rounded-lg hover:opacity-90 transition-opacity`}>
              <h4 className="font-semibold mb-2">{calc.title}</h4>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Understanding Lottery Taxes in the United States</h2>

        <div className="prose max-w-none">
          <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
            Winning the lottery is a life-changing event, but understanding the tax implications is crucial for financial planning. In the United States, lottery winnings are considered taxable income by both federal and state governments. The IRS treats lottery prizes as ordinary income, which means large jackpots can push winners into the highest tax bracket of 37%. This comprehensive guide explains how lottery taxes work and helps you estimate your actual take-home amount.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="bg-green-50 p-5 rounded-xl border border-green-100">
              <h3 className="font-semibold text-green-800 mb-3">Federal Tax Requirements</h3>
              <ul className="text-green-700 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>24% automatically withheld at the source</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Top marginal rate of 37% for winnings over $578,125</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Additional taxes due at filing if withholding is insufficient</li>
                <li className="flex items-start gap-2"><span className="text-green-500 mt-1">•</span>Mandatory reporting for prizes exceeding $600</li>
              </ul>
            </div>
            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-3">State Tax Variations</h3>
              <ul className="text-blue-700 text-sm space-y-2">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Rates range from 0% to over 13% depending on state</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Nine states have no income tax on lottery winnings</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Residency and purchase location both matter</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-1">•</span>Some cities impose additional local taxes</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">Lump Sum vs. Annuity: Making the Right Choice</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Most major lottery winners face a critical decision: take the entire prize as a lump sum or receive it as annual payments over 20-30 years. Each option has significant tax implications and financial trade-offs that can affect your long-term wealth.
          </p>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
            <div className="border-l-4 border-blue-500 pl-4 bg-blue-50/50 p-4 rounded-r-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Lump Sum Benefits</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Immediate access to full investment potential</li>
                <li>• Protection against inflation eroding future payments</li>
                <li>• Flexibility for major purchases or debt payoff</li>
                <li>• Estate planning advantages</li>
              </ul>
            </div>
            <div className="border-l-4 border-green-500 pl-4 bg-green-50/50 p-4 rounded-r-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Annuity Benefits</h4>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Guaranteed income stream for decades</li>
                <li>• Protection against impulsive spending</li>
                <li>• Potentially lower annual tax brackets</li>
                <li>• Built-in financial discipline</li>
              </ul>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-4">States With No Lottery Tax</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            If you live in or purchase tickets in certain states, you can avoid state income tax on your winnings. States with no lottery income tax include California (doesn&apos;t tax lottery but has high income tax), Florida, Texas, Washington, Wyoming, South Dakota, Tennessee, New Hampshire, and Alaska. However, you&apos;ll still owe federal taxes regardless of where you win.
          </p>

          <div className="bg-amber-50 p-5 rounded-xl border border-amber-200 mb-3 sm:mb-4 md:mb-6">
            <h4 className="font-semibold text-amber-800 mb-2">Pro Tip: Consult a Tax Professional</h4>
            <p className="text-amber-700 text-sm">
              Before claiming a large lottery prize, consider consulting with a tax attorney and financial advisor. They can help structure your winnings to minimize tax liability, set up trusts for asset protection, and create a sustainable financial plan.
            </p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>

        <div className="space-y-3 sm:space-y-4 md:space-y-6">
          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">How much tax do I pay on lottery winnings?</h3>
            <p className="text-gray-600 leading-relaxed">
              Federal taxes on lottery winnings can reach up to 37% for the highest earners, with 24% withheld immediately when you claim your prize. State taxes vary widely from 0% to over 13% depending on where you live and where you purchased the ticket. For a $1 million jackpot, you might expect to take home between $500,000 and $650,000 after all taxes, depending on your state.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Is it better to take the lump sum or annuity?</h3>
            <p className="text-gray-600 leading-relaxed">
              The lump sum is typically about 50-60% of the advertised jackpot, while the annuity pays the full amount over 20-30 years. If you&apos;re financially savvy and can invest wisely, the lump sum often provides greater long-term wealth. However, the annuity offers guaranteed income and protects against poor financial decisions. Consider your age, financial discipline, and investment knowledge when deciding.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Do I pay taxes on lottery winnings if I live in a state with no income tax?</h3>
            <p className="text-gray-600 leading-relaxed">
              You&apos;ll always owe federal income tax on lottery winnings regardless of your state. However, living in states like Florida, Texas, or Washington means you won&apos;t pay state income tax on your prize. If you bought the ticket in a different state, that state may still tax your winnings based on their non-resident rules. California notably doesn&apos;t tax lottery winnings even though it has high income tax rates.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Can I reduce my lottery tax burden legally?</h3>
            <p className="text-gray-600 leading-relaxed">
              Yes, several strategies can help minimize taxes on lottery winnings. Gifting money to family members (up to $17,000 per person per year tax-free), donating to qualified charities, setting up a charitable remainder trust, or spreading annuity payments over time to stay in lower tax brackets are all legal options. Consulting with a tax professional before claiming your prize is highly recommended.
            </p>
          </div>

          <div className="border-b border-gray-100 pb-5">
            <h3 className="text-lg font-medium text-gray-800 mb-2">What happens if I win the lottery while living abroad?</h3>
            <p className="text-gray-600 leading-relaxed">
              U.S. citizens and resident aliens must pay U.S. taxes on worldwide income, including lottery winnings, regardless of where they live. Non-resident aliens who win a U.S. lottery typically have 30% withheld for federal taxes. Tax treaties between countries may affect your final liability, so consulting an international tax specialist is essential for expat winners.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-800 mb-2">When do I have to pay taxes on my lottery winnings?</h3>
            <p className="text-gray-600 leading-relaxed">
              Taxes are due the year you receive the money. For lump sum payments, you&apos;ll report the entire amount on that year&apos;s tax return. For annuity payments, you report each annual payment as income in the year you receive it. The 24% federal withholding happens immediately when you claim your prize, but you may owe additional taxes when you file your return if your total tax liability exceeds the withholding amount.
            </p>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="lottery-tax-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
</div>
  );
}
