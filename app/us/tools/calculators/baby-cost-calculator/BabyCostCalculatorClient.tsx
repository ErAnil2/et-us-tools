'use client';

import { useState, useEffect } from 'react';
import ETLayout from '@/components/ETLayout';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Baby Cost Calculator?",
    answer: "A Baby Cost Calculator is a free online tool designed to help you quickly and accurately calculate baby cost-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Baby Cost Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Baby Cost Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Baby Cost Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function BabyCostCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('baby-cost-calculator');

  const [location, setLocation] = useState('medium');
  const [deliveryType, setDeliveryType] = useState('vaginal');
  const [insurance, setInsurance] = useState('good');
  const [feeding, setFeeding] = useState('combination');
  const [childcare, setChildcare] = useState('daycare');
  const [budgetLevel, setBudgetLevel] = useState('moderate');
  
  const [results, setResults] = useState({
    medical: 0,
    gear: 0,
    feeding: 0,
    diapers: 0,
    childcare: 0,
    clothing: 0,
    total: 0
  });

  useEffect(() => {
    calculateCosts();
  }, [location, deliveryType, insurance, feeding, childcare, budgetLevel]);

  const calculateCosts = () => {
    // Cost multipliers based on location
    const locationMultiplier = location === 'low' ? 0.8 : location === 'high' ? 1.3 : 1.0;
    
    // Medical costs
    let medicalCost = deliveryType === 'vaginal' ? 10000 : 15000;
    const insuranceCoverage = insurance === 'excellent' ? 0.85 : insurance === 'good' ? 0.7 : insurance === 'basic' ? 0.5 : 0;
    medicalCost = medicalCost * (1 - insuranceCoverage) * locationMultiplier;

    // Gear costs
    const gearMultiplier = budgetLevel === 'budget' ? 0.7 : budgetLevel === 'premium' ? 1.5 : 1.0;
    const gearCost = 2500 * gearMultiplier * locationMultiplier;

    // Feeding costs
    let feedingCost = 0;
    if (feeding === 'breastfeeding') feedingCost = 500;
    else if (feeding === 'combination') feedingCost = 1200;
    else feedingCost = 2000;
    feedingCost *= locationMultiplier;

    // Diapers
    const diapersCost = 900 * locationMultiplier;

    // Childcare
    let childcareCost = 0;
    if (childcare === 'daycare') childcareCost = 12000;
    else if (childcare === 'nanny') childcareCost = 18000;
    else if (childcare === 'family') childcareCost = 3000;
    childcareCost *= locationMultiplier;

    // Clothing
    const clothingCost = 600 * gearMultiplier * locationMultiplier;

    const total = medicalCost + gearCost + feedingCost + diapersCost + childcareCost + clothingCost;

    setResults({
      medical: medicalCost,
      gear: gearCost,
      feeding: feedingCost,
      diapers: diapersCost,
      childcare: childcareCost,
      clothing: clothingCost,
      total
    });
  };

  return (
    <ETLayout>
      <div className="max-w-[1180px] mx-auto px-6 py-6 md:py-8">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-lg sm:text-xl md:text-2xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Baby Cost Calculator')}</h1>
          <p className="text-sm md:text-base text-gray-600">Plan your budget for baby's first year with comprehensive expense tracking</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
                <span>👶</span> Baby Basics
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Location Type</label>
                  <select
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="low">Rural/Low Cost Area</option>
                    <option value="medium">Suburban/Medium Cost</option>
                    <option value="high">Urban/High Cost Area</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Delivery Type</label>
                  <select
                    value={deliveryType}
                    onChange={(e) => setDeliveryType(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="vaginal">Vaginal Delivery</option>
                    <option value="cesarean">C-Section</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Insurance Coverage</label>
                  <select
                    value={insurance}
                    onChange={(e) => setInsurance(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="excellent">Excellent (80-90%)</option>
                    <option value="good">Good (60-80%)</option>
                    <option value="basic">Basic (40-60%)</option>
                    <option value="none">No Insurance</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Feeding Method</label>
                  <select
                    value={feeding}
                    onChange={(e) => setFeeding(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="breastfeeding">Breastfeeding Only</option>
                    <option value="combination">Combination</option>
                    <option value="formula">Formula Only</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Childcare Option</label>
                  <select
                    value={childcare}
                    onChange={(e) => setChildcare(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="none">Parent Stays Home</option>
                    <option value="family">Family/Friend Care</option>
                    <option value="nanny">Nanny/Babysitter</option>
                    <option value="daycare">Daycare Center</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Budget Preference</label>
                  <select
                    value={budgetLevel}
                    onChange={(e) => setBudgetLevel(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="budget">Budget Conscious</option>
                    <option value="moderate">Moderate Spending</option>
                    <option value="premium">Premium Products</option>
                  </select>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">First Year Total</h3>
              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-pink-600">${results.total.toLocaleString()}</div>
                <div className="text-sm text-gray-600 mt-1">Estimated Total Cost</div>
              </div>

              <div className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between p-2 bg-blue-50 rounded">
                  <span>Medical:</span>
                  <span className="font-semibold">${results.medical.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-green-50 rounded">
                  <span>Childcare:</span>
                  <span className="font-semibold">${results.childcare.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-purple-50 rounded">
                  <span>Gear:</span>
                  <span className="font-semibold">${results.gear.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-orange-50 rounded">
                  <span>Feeding:</span>
                  <span className="font-semibold">${results.feeding.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-yellow-50 rounded">
                  <span>Diapers:</span>
                  <span className="font-semibold">${results.diapers.toLocaleString()}</span>
                </div>
                <div className="flex justify-between p-2 bg-pink-50 rounded">
                  <span>Clothing:</span>
                  <span className="font-semibold">${results.clothing.toLocaleString()}</span>
                </div>
              </div>
            </div>
</div>
        </div>
        <RelatedCalculatorCards title="Related Finance Calculators" calculators={relatedCalculators} />

        {/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">The True Cost of Having a Baby in 2024</h2>

          <div className="prose prose-gray max-w-none">
            <p className="text-gray-600 mb-6 leading-relaxed">
              Bringing a new life into the world is one of life's greatest joys—but it also comes with significant financial considerations. According to the USDA, raising a child from birth to age 18 costs an average of $233,610, and that's before college expenses. The first year alone typically costs between $12,000 and $25,000 depending on your location, childcare needs, and lifestyle choices. This baby cost calculator helps expectant parents prepare financially for their bundle of joy.
            </p>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Major First-Year Expenses Breakdown</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-5 border border-blue-100">
                <h4 className="text-lg font-semibold text-blue-900 mb-2">🏥 Medical Costs</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Prenatal care: $2,000-$4,000</li>
                  <li>• Vaginal delivery: $5,000-$15,000</li>
                  <li>• C-section: $10,000-$25,000</li>
                  <li>• Pediatric visits (first year): $1,000-$2,000</li>
                </ul>
                <p className="text-xs text-blue-700 mt-2">*Costs shown before insurance coverage</p>
              </div>
              <div className="bg-green-50 rounded-xl p-5 border border-green-100">
                <h4 className="text-lg font-semibold text-green-900 mb-2">👶 Childcare</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Daycare center: $9,000-$22,000/year</li>
                  <li>• In-home nanny: $25,000-$50,000/year</li>
                  <li>• Nanny share: $15,000-$30,000/year</li>
                  <li>• Family care: Variable/Free</li>
                </ul>
                <p className="text-xs text-green-700 mt-2">*Varies significantly by location</p>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Essential Baby Gear Costs</h3>
            <div className="bg-gray-50 rounded-xl p-5 mb-6">
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Budget ($500-$1,500)</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Basic crib/bassinet</li>
                    <li>• Standard car seat</li>
                    <li>• Secondhand stroller</li>
                    <li>• Essential clothing only</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Moderate ($1,500-$3,500)</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Quality convertible crib</li>
                    <li>• Mid-range car seat</li>
                    <li>• New stroller system</li>
                    <li>• Baby monitor, swing</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-gray-800 mb-2">Premium ($3,500-$8,000+)</h5>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Designer nursery furniture</li>
                    <li>• Top-rated car seat</li>
                    <li>• Premium stroller brand</li>
                    <li>• Smart nursery tech</li>
                  </ul>
                </div>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Feeding Costs: Breastfeeding vs. Formula</h3>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-pink-50 rounded-xl p-5 border border-pink-100">
                <h4 className="font-semibold text-pink-900 mb-2">Breastfeeding ($500-$1,500/year)</h4>
                <ul className="text-sm text-pink-800 space-y-1">
                  <li>• Breast pump: $150-$500</li>
                  <li>• Nursing supplies: $100-$300</li>
                  <li>• Nursing bras/pads: $100-$200</li>
                  <li>• Lactation consultant: $100-$300</li>
                </ul>
              </div>
              <div className="bg-purple-50 rounded-xl p-5 border border-purple-100">
                <h4 className="font-semibold text-purple-900 mb-2">Formula Feeding ($1,500-$3,000/year)</h4>
                <ul className="text-sm text-purple-800 space-y-1">
                  <li>• Formula: $1,200-$2,500/year</li>
                  <li>• Bottles/nipples: $50-$150</li>
                  <li>• Bottle warmer/sterilizer: $50-$150</li>
                  <li>• Specialty formula adds 50-100%</li>
                </ul>
              </div>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Smart Ways to Save on Baby Costs</h3>
            <ul className="text-gray-600 space-y-2 mb-6">
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Buy secondhand:</strong> Items like strollers, swings, and clothes are often gently used. Save 50-70% on baby gear.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Accept hand-me-downs:</strong> Babies outgrow clothes in weeks. Gratefully accept used items from friends and family.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Use cloth diapers:</strong> Initial investment of $300-$500 saves $1,000+ over disposables in the first year.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Skip the nursery:</strong> Babies don't need Pinterest-perfect rooms. Focus on safe sleep essentials.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Wait on registry gifts:</strong> Don't buy everything before birth—you'll receive many items as gifts.</li>
              <li className="flex items-center gap-2"><span className="text-green-500">✓</span><strong>Consider FSA/HSA:</strong> Use pre-tax health accounts for medical expenses and breast pumps.</li>
            </ul>

            <h3 className="text-lg font-semibold text-gray-800 mb-3">Costs That Catch Parents Off Guard</h3>
            <div className="bg-amber-50 rounded-xl p-5 border border-amber-100 mb-6">
              <ul className="text-amber-800 space-y-2">
                <li className="flex items-start gap-2"><span className="font-bold">💡</span><strong>Lost income:</strong> Unpaid parental leave can mean 6-12 weeks without income. Plan ahead.</li>
                <li className="flex items-start gap-2"><span className="font-bold">💡</span><strong>Health insurance changes:</strong> Adding baby to your plan increases premiums $200-$500/month.</li>
                <li className="flex items-start gap-2"><span className="font-bold">💡</span><strong>Housing adjustments:</strong> Many families need to move to larger homes or childproof existing space.</li>
                <li className="flex items-start gap-2"><span className="font-bold">💡</span><strong>Transportation:</strong> May need a larger vehicle to accommodate car seats and gear.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-6">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">Frequently Asked Questions</h2>

          <div className="space-y-5">
            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">How much should I save before having a baby?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Financial experts recommend saving 3-6 months of living expenses plus an additional $10,000-$20,000 specifically for baby costs. This covers medical expenses, lost income during leave, and essential gear. Start saving as soon as you're planning to conceive—the more runway, the better.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">What's the biggest expense in baby's first year?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                For most families, childcare is the largest expense—often exceeding $12,000 annually. For those with one parent staying home, medical costs (including delivery) typically top the list. Location matters enormously: childcare in San Francisco can cost $2,500/month versus $800/month in rural areas.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Is it cheaper to breastfeed or formula feed?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Breastfeeding is generally cheaper, costing $500-$1,500 for supplies versus $1,500-$3,000 for formula annually. However, if breastfeeding requires significant lactation support or pumping equipment for working moms, costs can approach formula feeding. Consider your lifestyle, work situation, and personal preferences.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">Should I buy everything new for baby?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Absolutely not! The only items experts recommend buying new are car seats (for safety certification) and crib mattresses (for hygiene). Everything else—strollers, swings, clothes, toys—can be safely purchased secondhand. Check Facebook Marketplace, Once Upon a Child stores, and consignment sales. You can easily save 50-70% on baby gear this way.
              </p>
            </div>

            <div className="border-b border-gray-100 pb-5">
              <h3 className="text-base font-semibold text-gray-800 mb-2">How do I afford childcare on a tight budget?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Consider these options: nanny sharing with another family (cuts costs in half), family/friend care exchanges, employer-dependent care FSA ($5,000 pre-tax savings), or shifting to offset work schedules so one parent is always home. Some states offer childcare subsidies for lower-income families—check your state's Department of Social Services.
              </p>
            </div>

            <div className="pb-2">
              <h3 className="text-base font-semibold text-gray-800 mb-2">What tax benefits are available for new parents?</h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                New parents can benefit from: Child Tax Credit (up to $2,000/child), Dependent Care FSA (up to $5,000 pre-tax for childcare), Child and Dependent Care Credit (20-35% of childcare expenses), and state-specific tax credits. Also update your W-4 withholding to reflect your new dependent—this increases take-home pay throughout the year.
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
                Cost estimates are based on national averages and may vary significantly by location, personal choices, and healthcare coverage. This calculator provides general guidance for planning purposes. Consult with your healthcare provider and financial advisor for personalized recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="baby-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </ETLayout>
  );
}
