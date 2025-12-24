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
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type ServiceType = 'restaurant' | 'bar' | 'delivery' | 'salon' | 'taxi' | 'hotel';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is the standard tip percentage at restaurants?",
    answer: "The standard tip at US restaurants is 15-20% of the pre-tax bill. For good service, 15-18% is appropriate. For excellent service, 20% or more is customary. In fine dining establishments, 20% is often the baseline. Always tip on the pre-tax amount.",
    order: 1
  },
  {
    id: '2',
    question: "Should I tip on the pre-tax or post-tax amount?",
    answer: "Traditionally, tipping on the pre-tax amount is correct. However, many people tip on the post-tax total for convenience. Either way is acceptable - the difference is typically small. For example, on a $100 pre-tax bill with 8% tax, a 20% tip would be $20 (pre-tax) vs $21.60 (post-tax).",
    order: 2
  },
  {
    id: '3',
    question: "How much should I tip for delivery?",
    answer: "For delivery, tip 15-20% with a minimum of $3-5, as drivers use their own vehicles and gas. For food delivery apps, tip at least $3-5 for small orders, more for larger orders or difficult conditions. The delivery fee usually doesn't go to the driver.",
    order: 3
  },
  {
    id: '4',
    question: "When is it appropriate NOT to tip?",
    answer: "Generally, you don't tip at fast food counters, retail stores, or counter-service restaurants. You also don't typically tip business owners who serve you themselves. In some countries, tipping is not expected - research before traveling internationally.",
    order: 4
  },
  {
    id: '5',
    question: "How do I split a bill fairly?",
    answer: "For equal orders, divide the total evenly. For different orders, each person pays their portion plus proportional tip. This calculator helps with equal splitting - for itemized splits, calculate individual tips on each person's subtotal.",
    order: 5
  }
];

export default function TipCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('tip-calculator');

  const [billAmount, setBillAmount] = useState(85);
  const [customTip, setCustomTip] = useState(18);
  const [selectedTip, setSelectedTip] = useState(18);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [serviceQuality, setServiceQuality] = useState<'poor' | 'average' | 'good' | 'excellent'>('good');
  const [serviceType, setServiceType] = useState<ServiceType>('restaurant');
  const [roundUp, setRoundUp] = useState(false);

  const [tipAmount, setTipAmount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [perPersonTotal, setPerPersonTotal] = useState(0);
  const [perPersonTip, setPerPersonTip] = useState(0);

  const quickTipOptions = [
    { percent: 10, label: '10%', description: 'Basic' },
    { percent: 15, label: '15%', description: 'Fair' },
    { percent: 18, label: '18%', description: 'Good' },
    { percent: 20, label: '20%', description: 'Great' },
    { percent: 25, label: '25%', description: 'Excellent' }
  ];

  const serviceTypes = [
    { type: 'restaurant' as ServiceType, icon: '🍽️', label: 'Restaurant', suggestedTip: '15-20%' },
    { type: 'bar' as ServiceType, icon: '🍺', label: 'Bar', suggestedTip: '$1-2/drink' },
    { type: 'delivery' as ServiceType, icon: '🚗', label: 'Delivery', suggestedTip: '15-20%' },
    { type: 'salon' as ServiceType, icon: '💇', label: 'Salon', suggestedTip: '15-20%' },
    { type: 'taxi' as ServiceType, icon: '🚕', label: 'Taxi/Uber', suggestedTip: '10-15%' },
    { type: 'hotel' as ServiceType, icon: '🏨', label: 'Hotel', suggestedTip: '$2-5' }
  ];

  useEffect(() => {
    calculateTip();
  }, [billAmount, selectedTip, numberOfPeople, roundUp]);

  const calculateTip = () => {
    const tip = (billAmount * selectedTip) / 100;
    let total = billAmount + tip;

    if (roundUp) {
      total = Math.ceil(total);
    }

    const actualTip = total - billAmount;
    const perPerson = total / numberOfPeople;
    const tipPerPerson = actualTip / numberOfPeople;

    setTipAmount(actualTip);
    setTotalAmount(total);
    setPerPersonTotal(perPerson);
    setPerPersonTip(tipPerPerson);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const handleTipSelect = (percent: number) => {
    setSelectedTip(percent);
    setCustomTip(percent);
  };

  const handleCustomTipChange = (value: number) => {
    setCustomTip(value);
    setSelectedTip(value);
  };

  const getSuggestedTip = () => {
    switch (serviceQuality) {
      case 'poor': return 10;
      case 'average': return 15;
      case 'good': return 18;
      case 'excellent': return 25;
      default: return 18;
    }
  };

  const applySuggestedTip = () => {
    const suggested = getSuggestedTip();
    setSelectedTip(suggested);
    setCustomTip(suggested);
  };

  return (
    <div className="max-w-[1200px] mx-auto px-3 xs:px-2 sm:px-4 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl xs:text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 sm:mb-3">{getH1('Tip Calculator')}</h1>
        <p className="text-sm sm:text-base text-gray-600">Calculate tips and split bills easily</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-4 sm:mb-4 md:mb-6">
        <div className="grid lg:grid-cols-5 gap-4 sm:gap-6 md:gap-8">
          {/* Input Section - 3 columns on large screens */}
          <div className="lg:col-span-3 space-y-4 sm:space-y-4 md:space-y-6">
            {/* Bill Amount */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Bill Amount</label>
              <div className="relative">
                <span className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg sm:text-xl font-medium">$</span>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(parseFloat(e.target.value) || 0)}
                  className="w-full pl-8 sm:pl-10 pr-4 py-3 sm:py-4 text-xl sm:text-2xl font-bold border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>
            </div>

            {/* Service Type Quick Select */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Service Type</label>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {serviceTypes.map((service) => (
                  <button
                    key={service.type}
                    onClick={() => setServiceType(service.type)}
                    className={`p-2 sm:p-3 rounded-lg text-center transition-all ${
                      serviceType === service.type
                        ? 'bg-blue-100 border-2 border-blue-500 shadow-md'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-lg sm:text-xl mb-1">{service.icon}</div>
                    <div className="text-xs font-medium text-gray-700">{service.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Tip Percentage */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Tip Percentage</label>
                <span className="text-lg sm:text-xl font-bold text-blue-600">{selectedTip}%</span>
              </div>

              {/* Quick Tip Buttons */}
              <div className="grid grid-cols-5 gap-1 xs:gap-2 mb-3">
                {quickTipOptions.map((option) => (
                  <button
                    key={option.percent}
                    onClick={() => handleTipSelect(option.percent)}
                    className={`py-2 xs:py-3 px-1 xs:px-2 rounded-lg font-medium transition-all text-xs xs:text-sm ${
                      selectedTip === option.percent
                        ? 'bg-blue-600 text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-bold">{option.label}</div>
                    <div className="text-[10px] xs:text-xs opacity-75 hidden xs:block">{option.description}</div>
                  </button>
                ))}
              </div>

              {/* Custom Tip Slider */}
              <div className="relative pt-2">
                <input
                  type="range"
                  min="0"
                  max="35"
                  step="1"
                  value={customTip}
                  onChange={(e) => handleCustomTipChange(parseInt(e.target.value))}
                  className="w-full h-2 bg-gradient-to-r from-red-200 via-yellow-200 to-green-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>0%</span>
                  <span>35%</span>
                </div>
              </div>
            </div>

            {/* Service Quality */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Rate Service Quality</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { quality: 'poor' as const, emoji: '😞', label: 'Poor', tip: '10%' },
                  { quality: 'average' as const, emoji: '😐', label: 'Average', tip: '15%' },
                  { quality: 'good' as const, emoji: '😊', label: 'Good', tip: '18%' },
                  { quality: 'excellent' as const, emoji: '🤩', label: 'Excellent', tip: '25%' }
                ].map((item) => (
                  <button
                    key={item.quality}
                    onClick={() => {
                      setServiceQuality(item.quality);
                      handleTipSelect(parseInt(item.tip));
                    }}
                    className={`p-2 sm:p-3 rounded-lg text-center transition-all ${
                      serviceQuality === item.quality
                        ? 'bg-yellow-100 border-2 border-yellow-400 shadow-md'
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="text-xl sm:text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-medium text-gray-700">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.tip}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of People */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium text-gray-700">Split Between</label>
                <span className="text-lg font-bold text-purple-600">{numberOfPeople} {numberOfPeople === 1 ? 'person' : 'people'}</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setNumberOfPeople(Math.max(1, numberOfPeople - 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-xl hover:bg-purple-200 transition-colors"
                >
                  -
                </button>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(parseInt(e.target.value))}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <button
                  onClick={() => setNumberOfPeople(Math.min(20, numberOfPeople + 1))}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-purple-100 text-purple-700 font-bold text-xl hover:bg-purple-200 transition-colors"
                >
                  +
                </button>
              </div>
            </div>

            {/* Round Up Option */}
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-700">Round up total</span>
                <p className="text-xs text-gray-500">Round to nearest dollar</p>
              </div>
              <button
                onClick={() => setRoundUp(!roundUp)}
                className={`w-12 h-6 rounded-full transition-colors ${roundUp ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${roundUp ? 'translate-x-6' : 'translate-x-0.5'}`} />
              </button>
            </div>
          </div>

          {/* Results Section - 2 columns on large screens */}
          <div className="lg:col-span-2">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-3 sm:p-4 border-2 border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Results</h3>

              {/* Main Results */}
              <div className="space-y-3 sm:space-y-4">
                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                  <div className="text-xs sm:text-sm text-gray-500">Tip Amount</div>
                  <div className="text-xl sm:text-2xl font-bold text-blue-600">{formatCurrency(tipAmount)}</div>
                </div>

                <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                  <div className="text-xs sm:text-sm text-gray-500">Total Bill</div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(totalAmount)}</div>
                </div>

                {numberOfPeople > 1 && (
                  <>
                    <div className="border-t border-blue-200 pt-3 sm:pt-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">Per Person:</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500">Tip per Person</div>
                      <div className="text-lg sm:text-xl font-bold text-purple-600">{formatCurrency(perPersonTip)}</div>
                    </div>

                    <div className="bg-white rounded-lg p-3 sm:p-4 shadow-sm">
                      <div className="text-xs sm:text-sm text-gray-500">Total per Person</div>
                      <div className="text-lg sm:text-xl font-bold text-purple-600">{formatCurrency(perPersonTotal)}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Summary */}
              <div className="mt-4 pt-4 border-t border-blue-200">
                <div className="text-xs sm:text-sm text-gray-600">
                  <span className="font-medium">Bill:</span> {formatCurrency(billAmount)} + <span className="font-medium">Tip ({selectedTip}%):</span> {formatCurrency(tipAmount)} = <span className="font-bold text-gray-800">{formatCurrency(totalAmount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners */}
      <CalculatorAfterCalcBanners />

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Understanding Tipping in the United States</h2>

        <div className="prose prose-gray max-w-none">
          <p className="text-gray-600 mb-4">
            Tipping is an important part of American service culture, providing a significant portion of income for service workers. Understanding when and how much to tip ensures you are compensating workers fairly while managing your budget appropriately.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6 not-prose">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-700">15-20%</div>
              <div className="text-xs text-green-600">Restaurant Standard</div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-700">$1-2</div>
              <div className="text-xs text-blue-600">Per Drink at Bar</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-700">15-20%</div>
              <div className="text-xs text-purple-600">Delivery & Salon</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Why Service Workers Depend on Tips</h3>
          <p className="text-gray-600 mb-4">
            In the US, many service workers receive a lower minimum wage (as low as $2.13/hour federally for tipped workers) with the expectation that tips will make up the difference. This means your tip directly impacts whether a server, bartender, or delivery driver earns a living wage. For excellent service, 20% or more is appropriate; for standard service, 15-18% is expected.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Tipping by Service Type</h3>
          <div className="grid sm:grid-cols-2 gap-4 my-4 not-prose">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Restaurants & Bars</h4>
              <p className="text-sm text-gray-600">15-20% for sit-down service. For takeout, 10-15% or $2-3 minimum. At bars, $1-2 per drink or 15-20% of the tab.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Delivery Services</h4>
              <p className="text-sm text-gray-600">15-20% with $3-5 minimum. Tip more for bad weather, long distances, or large orders. The delivery fee rarely goes to the driver.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Hair & Beauty Services</h4>
              <p className="text-sm text-gray-600">15-20% of the service cost. Tip each person who provides service (stylist, shampoo person). Cash is often preferred.</p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">Rideshare & Taxi</h4>
              <p className="text-sm text-gray-600">10-20% for taxis, 15-20% for rideshare. More for help with luggage or waiting. Round up for short trips.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Splitting the Bill Fairly</h3>
          <p className="text-gray-600">
            When dining with a group, you can split evenly (if orders are similar) or pay for your own items plus proportional tip. Many restaurants can split checks, or use apps like Venmo or Splitwise. Always calculate tip on the pre-tax total for the most accurate amount, and remember to account for any shared appetizers or drinks.
          </p>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section - Firebase Powered */}
      <div className="mb-6 md:mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="tip-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Related Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 sm:gap-3">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-3 sm:p-4 bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors mb-1">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-2">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
