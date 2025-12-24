'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface CarbonFootprintClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Carbon Footprint Calculator?",
    answer: "A Carbon Footprint Calculator is a free online tool designed to help you quickly and accurately calculate carbon footprint-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Carbon Footprint Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Carbon Footprint Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Carbon Footprint Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CarbonFootprintClient({ relatedCalculators = defaultRelatedCalculators }: CarbonFootprintClientProps) {
  // Transportation
  const { getH1, getSubHeading } = usePageSEO('carbon-footprint-calculator');

  const [carMiles, setCarMiles] = useState(100);
  const [flightHours, setFlightHours] = useState(2);
  const [publicTransit, setPublicTransit] = useState(50);

  // Home Energy
  const [electricity, setElectricity] = useState(800);
  const [naturalGas, setNaturalGas] = useState(50);

  // Lifestyle
  const [diet, setDiet] = useState('omnivore');
  const [shopping, setShopping] = useState('moderate');

  const [totalFootprint, setTotalFootprint] = useState(0);
  const [transportFootprint, setTransportFootprint] = useState(0);
  const [energyFootprint, setEnergyFootprint] = useState(0);
  const [lifestyleFootprint, setLifestyleFootprint] = useState(0);

  useEffect(() => {
    calculateFootprint();
  }, [carMiles, flightHours, publicTransit, electricity, naturalGas, diet, shopping]);

  const calculateFootprint = () => {
    // Transportation (kg CO2/month)
    const carCO2 = carMiles * 0.404; // 0.404 kg CO2 per mile
    const flightCO2 = flightHours * 90; // ~90 kg CO2 per hour
    const transitCO2 = publicTransit * 0.14; // 0.14 kg CO2 per mile
    const transport = carCO2 + flightCO2 + transitCO2;

    // Home Energy (kg CO2/month)
    const electricityCO2 = electricity * 0.42; // 0.42 kg CO2 per kWh
    const gasCO2 = naturalGas * 5.3; // 5.3 kg CO2 per therm
    const energy = electricityCO2 + gasCO2;

    // Lifestyle (kg CO2/month)
    const dietFactors = {
      vegan: 50,
      vegetarian: 100,
      omnivore: 150,
      meatHeavy: 200
    };

    const shoppingFactors = {
      minimal: 50,
      moderate: 100,
      frequent: 150
    };

    const lifestyle = dietFactors[diet as keyof typeof dietFactors] + shoppingFactors[shopping as keyof typeof shoppingFactors];

    setTransportFootprint(transport);
    setEnergyFootprint(energy);
    setLifestyleFootprint(lifestyle);
    setTotalFootprint(transport + energy + lifestyle);
  };

  const getImpactLevel = () => {
    const annual = totalFootprint * 12;
    if (annual < 4000) return { level: 'Low', color: 'green', text: 'Below average impact' };
    if (annual < 8000) return { level: 'Moderate', color: 'yellow', text: 'Average impact' };
    return { level: 'High', color: 'red', text: 'Above average impact' };
  };

  const impact = getImpactLevel();

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Carbon Footprint Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Carbon Footprint Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Calculate your environmental impact and get tips to reduce CO2 emissions
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Activities</h2>

            {/* Transportation */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-3">🚗 Transportation (Monthly)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Car Miles</label>
                  <input
                    type="number"
                    value={carMiles}
                    onChange={(e) => setCarMiles(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Flight Hours</label>
                  <input
                    type="number"
                    value={flightHours}
                    onChange={(e) => setFlightHours(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Public Transit Miles</label>
                  <input
                    type="number"
                    value={publicTransit}
                    onChange={(e) => setPublicTransit(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Home Energy */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-3">⚡ Home Energy (Monthly)</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-green-700 mb-1">Electricity (kWh)</label>
                  <input
                    type="number"
                    value={electricity}
                    onChange={(e) => setElectricity(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-green-700 mb-1">Natural Gas (therms)</label>
                  <input
                    type="number"
                    value={naturalGas}
                    onChange={(e) => setNaturalGas(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Lifestyle */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-3">🍽️ Lifestyle</h3>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-purple-700 mb-1">Diet</label>
                  <select
                    value={diet}
                    onChange={(e) => setDiet(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="vegan">Vegan</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="omnivore">Omnivore</option>
                    <option value="meatHeavy">Meat Heavy</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-purple-700 mb-1">Shopping Habits</label>
                  <select
                    value={shopping}
                    onChange={(e) => setShopping(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="minimal">Minimal</option>
                    <option value="moderate">Moderate</option>
                    <option value="frequent">Frequent</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Your Carbon Footprint</h3>

            <div className="space-y-4">
              <div className={`bg-${impact.color}-100 rounded-lg p-4 text-center`}>
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800">{Math.round(totalFootprint)}</div>
                <div className="text-gray-700">kg CO2/month</div>
                <div className={`text-sm mt-2 font-semibold text-${impact.color}-600`}>{impact.level} Impact</div>
                <div className="text-xs text-gray-600 mt-1">{impact.text}</div>
              </div>

              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-3">Breakdown</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Transportation</span>
                      <span className="font-semibold">{Math.round(transportFootprint)} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: `${(transportFootprint / totalFootprint) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Home Energy</span>
                      <span className="font-semibold">{Math.round(energyFootprint)} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${(energyFootprint / totalFootprint) * 100}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Lifestyle</span>
                      <span className="font-semibold">{Math.round(lifestyleFootprint)} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: `${(lifestyleFootprint / totalFootprint) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-100 rounded-lg p-4">
                <div className="text-sm text-yellow-700">Annual Footprint</div>
                <div className="text-2xl font-bold text-yellow-800">{Math.round(totalFootprint * 12)} kg CO2</div>
                <div className="text-xs text-yellow-600 mt-1">
                  ≈ {(totalFootprint * 12 / 1000).toFixed(1)} metric tons/year
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      <div className="bg-green-50 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-green-800 mb-4">🌱 Tips to Reduce Your Footprint</h3>
        <div className="grid md:grid-cols-3 gap-4 text-green-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Transportation</h4>
            <ul className="text-sm space-y-1">
              <li>• Use public transit</li>
              <li>• Carpool when possible</li>
              <li>• Consider electric vehicles</li>
              <li>• Bike or walk for short trips</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Home Energy</h4>
            <ul className="text-sm space-y-1">
              <li>• Switch to LED bulbs</li>
              <li>• Improve insulation</li>
              <li>• Use renewable energy</li>
              <li>• Unplug devices</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Lifestyle</h4>
            <ul className="text-sm space-y-1">
              <li>• Reduce meat consumption</li>
              <li>• Buy local produce</li>
              <li>• Reduce, reuse, recycle</li>
              <li>• Buy less, choose quality</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
      <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="carbon-footprint-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
