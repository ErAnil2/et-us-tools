'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
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

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
interface Props {
  relatedCalculators: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

// Fallback FAQs for SEO
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How do I calculate fuel cost for a trip?',
    answer: 'Divide your trip distance by your vehicle\'s MPG to get gallons needed, then multiply by the fuel price. Formula: (Distance ÷ MPG) × Fuel Price = Trip Cost. For example, a 300-mile trip at 25 MPG with $3.50/gallon gas costs: (300 ÷ 25) × $3.50 = $42.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'What is the average fuel economy for cars in the US?',
    answer: 'The average fuel economy for new vehicles in 2024 is about 26 MPG. Compact cars average 30-35 MPG, midsize sedans 25-30 MPG, SUVs 20-25 MPG, and trucks 15-20 MPG. Hybrids can achieve 45-55 MPG.',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'How can I improve my car\'s fuel efficiency?',
    answer: 'Improve fuel efficiency by: maintaining proper tire pressure (can improve MPG by 3%), removing excess weight, avoiding aggressive driving (saves 15-30% on highways), using cruise control, keeping up with maintenance, and avoiding excessive idling.',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'Is it cheaper to drive or fly?',
    answer: 'For trips under 300 miles, driving is usually cheaper, especially with multiple passengers. For 300-500 miles, it depends on gas prices and ticket costs. Over 500 miles, flying is often more economical when considering time and total costs.',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How do I calculate cost per mile for my vehicle?',
    answer: 'Cost per mile = Fuel Price ÷ MPG. For example, at $3.50/gallon with 25 MPG: $3.50 ÷ 25 = $0.14 per mile. For total operating cost, add insurance, maintenance, and depreciation (average total: $0.50-0.70/mile).',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'What factors affect fuel consumption the most?',
    answer: 'Major factors include: driving speed (optimal is 45-65 MPH), vehicle weight and aerodynamics, driving style (aggressive vs smooth), terrain (hills use more fuel), weather (cold reduces efficiency), and air conditioning use (can reduce MPG by 5-25%).',
    order: 6
  }
];

// Common vehicle presets
const vehiclePresets = [
  { name: 'Compact Car', mpg: 32, icon: '🚗' },
  { name: 'Sedan', mpg: 28, icon: '🚙' },
  { name: 'SUV', mpg: 22, icon: '🚐' },
  { name: 'Truck', mpg: 18, icon: '🛻' },
  { name: 'Hybrid', mpg: 50, icon: '🔋' },
  { name: 'Electric (MPGe)', mpg: 100, icon: '⚡' },
];

// Common trip presets
const tripPresets = [
  { name: 'Daily Commute', miles: 30, icon: '🏢' },
  { name: 'Weekend Trip', miles: 150, icon: '🏖️' },
  { name: 'Road Trip', miles: 500, icon: '🗺️' },
  { name: 'Cross Country', miles: 2500, icon: '🌎' },
];

export default function FuelCostCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // Firebase SEO data
  const { getH1, getSubHeading, faqSchema } = usePageSEO('fuel-cost-calculator');

  const [distance, setDistance] = useState(300);
  const [fuelEfficiency, setFuelEfficiency] = useState(25);
  const [fuelPrice, setFuelPrice] = useState(3.50);
  const [isRoundTrip, setIsRoundTrip] = useState(false);
  const [passengers, setPassengers] = useState(1);

  // Results
  const [results, setResults] = useState({
    fuelNeeded: 0,
    totalCost: 0,
    costPerMile: 0,
    costPerPerson: 0,
    co2Emissions: 0,
  });

  useEffect(() => {
    const effectiveDistance = isRoundTrip ? distance * 2 : distance;
    const fuelNeeded = effectiveDistance / fuelEfficiency;
    const totalCost = fuelNeeded * fuelPrice;
    const costPerMile = fuelPrice / fuelEfficiency;
    const costPerPerson = totalCost / passengers;
    const co2Emissions = fuelNeeded * 19.6; // lbs of CO2 per gallon

    setResults({
      fuelNeeded,
      totalCost,
      costPerMile,
      costPerPerson,
      co2Emissions,
    });
  }, [distance, fuelEfficiency, fuelPrice, isRoundTrip, passengers]);

  const effectiveDistance = isRoundTrip ? distance * 2 : distance;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Fuel Cost Calculator",
            "description": "Calculate trip fuel costs, gas expenses, and cost per mile. Estimate fuel consumption for road trips and daily commutes.",
            "applicationCategory": "UtilityApplication",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })
        }}
      />
      {/* Mobile MREC2 - Before FAQs */}

      <CalculatorMobileMrec2 />


      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Fuel Cost Calculator')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {getSubHeading('Calculate trip fuel costs, gas expenses, and cost per mile for your road trips and daily commutes')}
          </p>
        </header>

        {/* Main Calculator */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Input Section */}
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Trip Details</h2>

              {/* Distance Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Distance (miles)
                </label>
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value) || 0)}
                  min="0"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <div className="flex items-center mt-2">
                  <input
                    type="checkbox"
                    id="roundTrip"
                    checked={isRoundTrip}
                    onChange={(e) => setIsRoundTrip(e.target.checked)}
                    className="mr-2 w-4 h-4 text-green-600"
                  />
                  <label htmlFor="roundTrip" className="text-sm text-gray-600">
                    Round trip (doubles the distance)
                  </label>
                </div>
              </div>

              {/* Quick Trip Presets */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-3">Quick Trip Presets</h4>
                <div className="grid grid-cols-2 gap-2">
                  {tripPresets.map((preset) => (
                    <button
                      key={preset.name}
                      onClick={() => setDistance(preset.miles)}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded hover:bg-blue-200 text-sm transition-colors flex items-center justify-center gap-2"
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Efficiency Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Efficiency (MPG)
                </label>
                <input
                  type="number"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(Number(e.target.value) || 1)}
                  min="1"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {/* Vehicle Presets */}
              <div className="bg-green-50 rounded-lg p-4">
                <h4 className="font-semibold text-green-800 mb-3">Vehicle Types</h4>
                <div className="grid grid-cols-3 gap-2">
                  {vehiclePresets.map((vehicle) => (
                    <button
                      key={vehicle.name}
                      onClick={() => setFuelEfficiency(vehicle.mpg)}
                      className="px-3 py-2 bg-green-100 text-green-800 rounded hover:bg-green-200 text-sm transition-colors flex flex-col items-center"
                    >
                      <span className="text-lg">{vehicle.icon}</span>
                      <span className="text-xs">{vehicle.name}</span>
                      <span className="text-xs font-bold">{vehicle.mpg} MPG</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Fuel Price Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Fuel Price ($/gallon)
                </label>
                <input
                  type="number"
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
                <p className="text-xs text-gray-500 mt-1">Current US average: ~$3.40/gallon</p>
              </div>

              {/* Passengers */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Passengers
                </label>
                <input
                  type="number"
                  value={passengers}
                  onChange={(e) => setPassengers(Math.max(1, Number(e.target.value) || 1))}
                  min="1"
                  max="10"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Results Section */}
            <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6 space-y-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Trip Cost Summary</h3>

              {/* Total Cost - Primary Result */}
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-3 sm:p-4 md:p-6 text-center text-white">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-2">${results.totalCost.toFixed(2)}</div>
                <div className="text-lg font-semibold">Total Fuel Cost</div>
                {isRoundTrip && <div className="text-sm opacity-80">(Round Trip)</div>}
              </div>

              {/* Other Results */}
              <div className="space-y-3">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Total Distance:</span>
                  <span className="font-semibold text-gray-900">
                    {effectiveDistance.toLocaleString()} miles
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Fuel Needed:</span>
                  <span className="font-semibold text-blue-600">
                    {results.fuelNeeded.toFixed(2)} gallons
                  </span>
                </div>

                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="text-gray-600">Cost per Mile:</span>
                  <span className="font-semibold text-gray-900">
                    ${results.costPerMile.toFixed(3)}
                  </span>
                </div>

                {passengers > 1 && (
                  <div className="flex justify-between items-center py-3 border-b border-gray-200">
                    <span className="text-gray-600">Cost per Person:</span>
                    <span className="font-semibold text-green-600">
                      ${results.costPerPerson.toFixed(2)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-3">
                  <span className="text-gray-600">CO₂ Emissions:</span>
                  <span className="font-semibold text-orange-600">
                    {results.co2Emissions.toFixed(1)} lbs
                  </span>
                </div>
              </div>

              {/* Trip Summary */}
              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-800 mb-2">Trip Summary</h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <div>• {effectiveDistance} miles at {fuelEfficiency} MPG</div>
                  <div>• {results.fuelNeeded.toFixed(1)} gallons at ${fuelPrice.toFixed(2)}/gal</div>
                  {passengers > 1 && <div>• Split between {passengers} passengers</div>}
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedCalculators.map((calc, index) => (
              <Link key={index} href={calc.href} className="group">
                <div className="p-4 rounded-lg border border-gray-200 hover:border-green-500 hover:shadow-md transition-all">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                    {calc.title}
                  </h3>
                  <p className="text-sm text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Fuel Saving Tips */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 xs:mb-3 sm:mb-4 md:mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Fuel Saving Tips</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Driving Habits</h4>
              <ul className="text-sm text-green-700 space-y-1">
                <li>• Avoid rapid acceleration</li>
                <li>• Use cruise control on highways</li>
                <li>• Coast to stops when safe</li>
                <li>• Avoid excessive idling</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Vehicle Maintenance</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Keep tires properly inflated</li>
                <li>• Replace air filters regularly</li>
                <li>• Use recommended motor oil</li>
                <li>• Keep engine tuned up</li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <h4 className="font-semibold text-purple-800 mb-2">Trip Planning</h4>
              <ul className="text-sm text-purple-700 space-y-1">
                <li>• Combine errands into one trip</li>
                <li>• Use GPS for efficient routes</li>
                <li>• Avoid rush hour traffic</li>
                <li>• Carpool when possible</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Average Fuel Prices by State */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4 sm:mb-6 md:mb-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">US Fuel Price Reference</h3>
          <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
            <div>
              <h4 className="font-semibold text-red-800 mb-2">Highest Prices</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• California: ~$4.80/gallon</li>
                <li>• Hawaii: ~$4.60/gallon</li>
                <li>• Washington: ~$4.20/gallon</li>
                <li>• Nevada: ~$4.00/gallon</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-800 mb-2">Lowest Prices</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Mississippi: ~$2.80/gallon</li>
                <li>• Oklahoma: ~$2.85/gallon</li>
                <li>• Texas: ~$2.90/gallon</li>
                <li>• Louisiana: ~$2.90/gallon</li>
              </ul>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-4">*Prices are approximate and subject to change</p>
        </div>
{/* SEO Content Section */}
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8 prose prose-gray max-w-none">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4">Understanding Fuel Cost Calculations</h2>
          <p className="text-gray-600 mb-4">
            Calculating fuel costs for your trips helps you budget effectively and make informed decisions about travel. Whether you're planning a daily commute, weekend getaway, or cross-country road trip, understanding your vehicle's fuel consumption is essential for managing transportation expenses.
          </p>

          <div className="grid md:grid-cols-2 gap-4 my-6 not-prose">
            <div className="bg-green-50 p-4 rounded-lg">
              <h3 className="font-semibold text-green-800 mb-2">The Basic Formula</h3>
              <p className="text-sm text-green-700 mb-2">Fuel Cost = (Distance ÷ MPG) × Fuel Price</p>
              <p className="text-xs text-green-600">This simple calculation gives you the total fuel expense for any trip distance at your vehicle's fuel efficiency.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Cost Per Mile</h3>
              <p className="text-sm text-blue-700 mb-2">Cost/Mile = Fuel Price ÷ MPG</p>
              <p className="text-xs text-blue-600">Knowing your cost per mile helps compare different vehicles and calculate costs for any distance quickly.</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3 mt-6">Factors Affecting Fuel Economy</h3>
          <p className="text-gray-600 mb-4">
            Your vehicle's actual fuel efficiency varies based on multiple factors. Highway driving typically yields better MPG than city driving due to consistent speeds and fewer stops. Aggressive acceleration, excessive speed, and heavy braking can reduce fuel economy by 15-30%. Proper tire inflation, regular maintenance, and removing excess weight all contribute to optimal fuel efficiency.
          </p>

          <div className="grid md:grid-cols-3 gap-4 my-6 not-prose">
            <div className="bg-amber-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-amber-700">55-65 mph</div>
              <div className="text-xs text-amber-600">Optimal Speed Range</div>
            </div>
            <div className="bg-red-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-red-700">15-30%</div>
              <div className="text-xs text-red-600">MPG Loss from Aggressive Driving</div>
            </div>
            <div className="bg-teal-50 p-3 rounded-lg text-center">
              <div className="text-2xl font-bold text-teal-700">3%</div>
              <div className="text-xs text-teal-600">MPG Gain from Proper Tire Pressure</div>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Comparing Drive vs. Fly Decisions</h3>
          <p className="text-gray-600 mb-4">
            When planning longer trips, comparing driving costs to airfare helps determine the most economical option. For trips under 300 miles, driving is usually cheaper, especially with multiple passengers to split costs. The break-even point shifts around 300-500 miles depending on gas prices, vehicle efficiency, and ticket costs. Beyond 500 miles, flying often becomes more cost-effective when factoring in time, lodging, and meals.
          </p>

          <h3 className="text-lg font-semibold text-gray-800 mb-3">Environmental Impact</h3>
          <p className="text-gray-600">
            Every gallon of gasoline burned produces approximately 19.6 pounds of CO2. Understanding your trip's carbon footprint can help you make more environmentally conscious choices. Carpooling, choosing fuel-efficient vehicles, and combining trips all reduce both costs and environmental impact. Electric and hybrid vehicles offer significantly lower per-mile emissions, especially in regions with clean electricity grids.
          </p>
        </div>

        {/* FAQ Section */}
        <FirebaseFAQs pageId="fuel-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </article>
    </div>
  );
}
