'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface MpgCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// Fallback FAQs for MPG Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How do I calculate MPG (miles per gallon)?',
    answer: 'To calculate MPG, divide the total miles driven by the total gallons of gas used. For example, if you drove 300 miles on 12 gallons of gas, your MPG would be 300 ÷ 12 = 25 MPG. For the most accurate results, fill your tank completely, reset your trip odometer, drive normally until you need gas, then fill up again and record the gallons used.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is considered good gas mileage?',
    answer: 'Good gas mileage depends on vehicle type. For passenger cars, 30+ MPG is excellent, 25-30 MPG is good, 20-25 MPG is average. SUVs typically range from 20-25 MPG (good) to 15-20 MPG (average). Trucks usually get 15-20 MPG. Hybrid vehicles can achieve 40-60+ MPG, while electric vehicles get the equivalent of 100+ MPGe. The EPA average for all 2023 vehicles is about 26 MPG.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'Why does my actual MPG differ from the EPA estimate?',
    answer: 'EPA estimates are based on standardized laboratory tests that may not reflect real-world conditions. Your actual MPG can vary due to driving style (aggressive acceleration reduces MPG by 15-30%), speed (highway speeds over 50 mph decrease efficiency), weather (cold weather can reduce MPG by 10-20%), terrain, vehicle maintenance, and cargo weight. City driving typically yields lower MPG than highway driving.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'How can I improve my gas mileage?',
    answer: 'Improve your gas mileage by: maintaining steady speeds and using cruise control, avoiding rapid acceleration and hard braking, keeping tires properly inflated (under-inflation can reduce MPG by 3%), removing excess weight from your vehicle, using the recommended motor oil grade, keeping up with regular maintenance (air filters, spark plugs), avoiding excessive idling, and combining trips when possible.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What is the difference between city and highway MPG?',
    answer: 'City MPG measures fuel efficiency in stop-and-go urban driving conditions with frequent braking and acceleration, averaging speeds of 20 mph. Highway MPG measures efficiency on highways with steady cruising speeds averaging 48 mph. Highway MPG is typically 3-5 MPG higher than city because engines operate more efficiently at consistent speeds and don\'t waste energy on frequent stops and starts.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'How much can I save by improving my MPG?',
    answer: 'The savings from improved MPG can be significant. If you drive 12,000 miles per year and improve from 20 MPG to 25 MPG with gas at $3.50/gallon, you would save about $210 per year. Going from 25 MPG to 35 MPG saves about $280 annually. Over 5 years, these savings add up to $1,050-$1,400, making fuel-efficient driving habits and vehicle choices financially beneficial.',
    order: 6,
  },
];

// Vehicle presets for quick MPG estimation
const vehiclePresets = [
  { name: 'Compact Car', mpg: 32, icon: '🚗' },
  { name: 'Midsize Sedan', mpg: 28, icon: '🚙' },
  { name: 'SUV', mpg: 22, icon: '🚐' },
  { name: 'Pickup Truck', mpg: 18, icon: '🛻' },
  { name: 'Hybrid', mpg: 52, icon: '🔋' },
  { name: 'Electric (MPGe)', mpg: 110, icon: '⚡' },
];

export default function MpgCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: MpgCalculatorClientProps) {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('mpg-calculator');

  const [milesDriven, setMilesDriven] = useState(300);
  const [gallonsUsed, setGallonsUsed] = useState(12);
  const [gasPrice, setGasPrice] = useState(3.50);
  const [tripDistance, setTripDistance] = useState(500);

  const [mpg, setMpg] = useState(0);
  const [fuelCost, setFuelCost] = useState(0);
  const [costPerMile, setCostPerMile] = useState(0);
  const [gallonsNeeded, setGallonsNeeded] = useState(0);
  const [tripCost, setTripCost] = useState(0);
  const [co2Emissions, setCo2Emissions] = useState(0);
  const [annualFuelCost, setAnnualFuelCost] = useState(0);
  const [efficiencyRating, setEfficiencyRating] = useState({
    className: 'mt-4 p-3 bg-green-100 rounded-lg text-center',
    title: 'Good Fuel Efficiency',
    description: 'Above average for most vehicles',
    emoji: '✅'
  });

  useEffect(() => {
    calculateMPG();
  }, [milesDriven, gallonsUsed, gasPrice, tripDistance]);

  const calculateMPG = () => {
    if (gallonsUsed === 0) {
      setMpg(0);
      resetResults();
      return;
    }

    const calculatedMpg = milesDriven / gallonsUsed;
    const calculatedFuelCost = gallonsUsed * gasPrice;
    const calculatedCostPerMile = milesDriven > 0 ? calculatedFuelCost / milesDriven : 0;

    // Trip calculations
    const calculatedGallonsNeeded = calculatedMpg > 0 ? tripDistance / calculatedMpg : 0;
    const calculatedTripCost = calculatedGallonsNeeded * gasPrice;

    // CO2 emissions (average 19.6 lbs CO2 per gallon of gasoline)
    const calculatedCO2 = gallonsUsed * 19.6;

    // Annual fuel cost (assuming 12,000 miles/year)
    const annualMiles = 12000;
    const annualGallons = calculatedMpg > 0 ? annualMiles / calculatedMpg : 0;
    const calculatedAnnualCost = annualGallons * gasPrice;

    setMpg(calculatedMpg);
    setFuelCost(calculatedFuelCost);
    setCostPerMile(calculatedCostPerMile);
    setGallonsNeeded(calculatedGallonsNeeded);
    setTripCost(calculatedTripCost);
    setCo2Emissions(calculatedCO2);
    setAnnualFuelCost(calculatedAnnualCost);

    // Efficiency rating
    if (calculatedMpg >= 35) {
      setEfficiencyRating({
        className: 'mt-4 p-4 bg-green-100 rounded-lg text-center',
        title: 'Excellent Fuel Efficiency',
        description: 'Outstanding for the environment and your wallet!',
        emoji: '🌟'
      });
    } else if (calculatedMpg >= 30) {
      setEfficiencyRating({
        className: 'mt-4 p-4 bg-green-50 rounded-lg text-center',
        title: 'Very Good Fuel Efficiency',
        description: 'Above average - great job!',
        emoji: '✅'
      });
    } else if (calculatedMpg >= 25) {
      setEfficiencyRating({
        className: 'mt-4 p-4 bg-blue-100 rounded-lg text-center',
        title: 'Good Fuel Efficiency',
        description: 'At or above average for most vehicles',
        emoji: '👍'
      });
    } else if (calculatedMpg >= 20) {
      setEfficiencyRating({
        className: 'mt-4 p-4 bg-yellow-100 rounded-lg text-center',
        title: 'Average Fuel Efficiency',
        description: 'Room for improvement - check driving habits',
        emoji: '⚠️'
      });
    } else {
      setEfficiencyRating({
        className: 'mt-4 p-4 bg-red-100 rounded-lg text-center',
        title: 'Below Average Efficiency',
        description: 'Consider maintenance or driving habits',
        emoji: '🔧'
      });
    }
  };

  const resetResults = () => {
    setFuelCost(0);
    setCostPerMile(0);
    setGallonsNeeded(0);
    setTripCost(0);
    setCo2Emissions(0);
    setAnnualFuelCost(0);
  };

  const applyVehiclePreset = (preset: typeof vehiclePresets[0]) => {
    // Calculate gallons based on preset MPG
    const gallons = milesDriven / preset.mpg;
    setGallonsUsed(parseFloat(gallons.toFixed(2)));
  };

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "MPG Calculator",
    "description": "Calculate your vehicle's miles per gallon (MPG), fuel costs, and trip expenses. Track gas mileage and compare fuel efficiency.",
    "url": "https://www.example.com/us/tools/calculators/mpg-calculator",
    "applicationCategory": "Automotive Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-100 py-4 sm:py-6 md:py-8">
      {/* Schema.org markup */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <div className="max-w-[1180px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('MPG Calculator')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading("Calculate your vehicle's miles per gallon and fuel efficiency")}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Calculator */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 flex items-center gap-2">
                <span className="text-2xl">⛽</span> Calculate Your MPG
              </h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Vehicle Presets */}
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-green-800">Quick Presets - Select Vehicle Type</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {vehiclePresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyVehiclePreset(preset)}
                        className="p-3 bg-white hover:bg-green-100 border border-green-200 rounded-lg transition text-center"
                        title={`Typical ${preset.mpg} MPG`}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-xs text-gray-700 font-medium truncate">{preset.name}</div>
                        <div className="text-xs text-green-600">{preset.mpg} MPG</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Main Inputs */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-green-800">Trip Information</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Miles Driven
                      </label>
                      <input
                        type="number"
                        value={milesDriven}
                        onChange={(e) => setMilesDriven(parseFloat(e.target.value) || 0)}
                        step="0.1"
                        min="0"
                        placeholder="e.g., 300"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gallons Used
                      </label>
                      <input
                        type="number"
                        value={gallonsUsed}
                        onChange={(e) => setGallonsUsed(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        placeholder="e.g., 12"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                      />
                    </div>
                  </div>
                </div>

                {/* Cost Information */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-blue-800">Cost Calculation</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gas Price per Gallon ($)
                      </label>
                      <input
                        type="number"
                        value={gasPrice}
                        onChange={(e) => setGasPrice(parseFloat(e.target.value) || 0)}
                        step="0.01"
                        min="0"
                        placeholder="e.g., 3.50"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Trip Distance (miles)
                      </label>
                      <input
                        type="number"
                        value={tripDistance}
                        onChange={(e) => setTripDistance(parseFloat(e.target.value) || 0)}
                        step="1"
                        min="0"
                        placeholder="e.g., 500"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Efficiency Guide */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Fuel Efficiency Guide</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Excellent (30+ MPG)</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Hybrid vehicles</li>
                    <li>• Compact cars</li>
                    <li>• Efficient sedans</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Good (20-30 MPG)</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Mid-size sedans</li>
                    <li>• Small SUVs</li>
                    <li>• Most modern cars</li>
                  </ul>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Below 20 MPG</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Large trucks</li>
                    <li>• Full-size SUVs</li>
                    <li>• Performance vehicles</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Tips to Improve Your MPG</h3>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold text-green-800">Driving Habits</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Maintain steady speeds - use cruise control</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Avoid rapid acceleration and hard braking</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Reduce highway speeds - 55 mph is optimal</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-500 mt-0.5">✓</span>
                      <span>Combine trips to reduce cold starts</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold text-blue-800">Vehicle Maintenance</h4>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Keep tires properly inflated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Regular tune-ups and oil changes</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Replace air filters regularly</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-500 mt-0.5">✓</span>
                      <span>Use recommended motor oil grade</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <CalculatorMobileMrec2 />



            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
{/* Related Calculators */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {relatedCalculators.map((calc) => (
                  <Link
                    key={calc.href}
                    href={calc.href}
                    className={`${calc.color || 'bg-gray-500'} text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow`}
                  >
                    <h3 className="font-semibold mb-1">{calc.title}</h3>
                    <p className="text-sm text-white/90">{calc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main MPG Result */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Your Results
              </h3>

              <div className="space-y-4">
                {/* Primary MPG Display */}
                <div className="p-5 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl text-white text-center">
                  <div className="text-5xl font-bold">{mpg.toFixed(1)}</div>
                  <div className="text-green-100 mt-1">Miles Per Gallon</div>
                </div>

                {/* Efficiency Rating */}
                <div className={efficiencyRating.className}>
                  <div className="text-2xl mb-1">{efficiencyRating.emoji}</div>
                  <div className={`font-semibold ${
                    efficiencyRating.className.includes('green') ? 'text-green-800' :
                    efficiencyRating.className.includes('blue') ? 'text-blue-800' :
                    efficiencyRating.className.includes('yellow') ? 'text-yellow-800' :
                    'text-red-800'
                  }`}>{efficiencyRating.title}</div>
                  <div className={`text-sm ${
                    efficiencyRating.className.includes('green') ? 'text-green-700' :
                    efficiencyRating.className.includes('blue') ? 'text-blue-700' :
                    efficiencyRating.className.includes('yellow') ? 'text-yellow-700' :
                    'text-red-700'
                  }`}>{efficiencyRating.description}</div>
                </div>

                {/* Cost Results */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-sm text-gray-600">Fuel Cost for Trip</span>
                    <span className="font-bold text-red-600">${fuelCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Cost per Mile</span>
                    <span className="font-bold text-blue-600">${costPerMile.toFixed(3)}</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Gallons for {tripDistance} mi</span>
                    <span className="font-bold text-green-600">{gallonsNeeded.toFixed(1)} gal</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">Trip Cost ({tripDistance} mi)</span>
                    <span className="font-bold text-purple-600">${tripCost.toFixed(2)}</span>
                  </div>
                </div>

                {/* Annual Cost Estimate */}
                <div className="p-4 bg-gradient-to-r from-orange-500 to-amber-500 rounded-xl text-white">
                  <div className="text-sm text-orange-100 mb-1">Est. Annual Fuel Cost (12k mi)</div>
                  <div className="text-2xl font-bold">${annualFuelCost.toFixed(0)}</div>
                </div>

                {/* Environmental Impact */}
                <div className="p-3 bg-teal-50 rounded-lg">
                  <div className="text-sm text-teal-700">CO₂ Emissions</div>
                  <div className="font-bold text-teal-800">{co2Emissions.toFixed(1)} lbs</div>
                  <div className="text-xs text-teal-600">for {gallonsUsed} gallons used</div>
                </div>
              </div>
            </div>

            {/* US Gas Price Reference */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-amber-800 mb-3">US Gas Price Reference</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-amber-200">
                  <span className="text-amber-700">National Average</span>
                  <span className="font-medium text-amber-800">~$3.50/gal</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-amber-200">
                  <span className="text-amber-700">California</span>
                  <span className="font-medium text-amber-800">~$4.80/gal</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-amber-200">
                  <span className="text-amber-700">Texas</span>
                  <span className="font-medium text-amber-800">~$3.00/gal</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-amber-700">Florida</span>
                  <span className="font-medium text-amber-800">~$3.40/gal</span>
                </div>
              </div>
              <p className="text-xs text-amber-600 mt-2">*Prices approximate and vary by location</p>
            </div>

            {/* Quick Conversions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Unit Conversions</h3>
              <div className="space-y-2 text-sm text-blue-700">
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 US gallon = 3.785 liters</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>1 mile = 1.609 kilometers</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>MPG × 0.425 = km/L</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">•</span>
                  <span>L/100km = 235.21 ÷ MPG</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
