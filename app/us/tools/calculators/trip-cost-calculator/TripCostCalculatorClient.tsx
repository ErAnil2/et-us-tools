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

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];
interface Props {
  relatedCalculators?: RelatedCalculator[];
  faqSchema: any;
  calculatorSchema: any;
}

interface CategoryBreakdown {
  name: string;
  total: number;
  color: string;
  icon: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Trip Cost Calculator?",
    answer: "A Trip Cost Calculator is a free online tool designed to help you quickly and accurately calculate trip cost-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Trip Cost Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Trip Cost Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Trip Cost Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function TripCostCalculatorClient({ relatedCalculators = defaultRelatedCalculators, faqSchema, calculatorSchema }: Props) {
  // Trip Overview
  const { getH1, getSubHeading } = usePageSEO('trip-cost-calculator');

  const [destination, setDestination] = useState('Paris, France');
  const [tripDays, setTripDays] = useState(7);
  const [travelers, setTravelers] = useState(2);

  // Transportation
  const [flightCost, setFlightCost] = useState(500);
  const [airportTransfer, setAirportTransfer] = useState(80);
  const [carRental, setCarRental] = useState(0);
  const [localTransport, setLocalTransport] = useState(150);

  // Accommodation
  const [hotelCost, setHotelCost] = useState(120);
  const [hotelFees, setHotelFees] = useState(50);

  // Food
  const [dailyFood, setDailyFood] = useState(60);
  const [specialDining, setSpecialDining] = useState(200);
  const [groceries, setGroceries] = useState(80);
  const [drinks, setDrinks] = useState(150);

  // Activities
  const [tours, setTours] = useState(400);
  const [entertainment, setEntertainment] = useState(100);
  const [shopping, setShopping] = useState(200);
  const [miscellaneous, setMiscellaneous] = useState(150);

  // Results
  const [results, setResults] = useState({
    grandTotal: 0,
    costPerPerson: 0,
    dailyCost: 0,
    budgetLevel: 'Moderate Budget',
    budgetColor: 'text-blue-600',
    transportTotal: 0,
    accommodationTotal: 0,
    foodTotal: 0,
    activitiesTotal: 0,
    totalFlights: 0,
    totalDailyFood: 0,
    categories: [] as CategoryBreakdown[],
    tips: [] as string[]
  });

  useEffect(() => {
    calculateTrip();
  }, [
    destination, tripDays, travelers,
    flightCost, airportTransfer, carRental, localTransport,
    hotelCost, hotelFees,
    dailyFood, specialDining, groceries, drinks,
    tours, entertainment, shopping, miscellaneous
  ]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const calculateTrip = () => {
    // Calculate category totals
    const totalFlights = flightCost * travelers;
    const transportTotal = totalFlights + airportTransfer + carRental + localTransport;

    const accommodationTotal = (hotelCost * tripDays) + hotelFees;

    const totalDailyFood = dailyFood * travelers * tripDays;
    const foodTotal = totalDailyFood + specialDining + groceries + drinks;

    const activitiesTotal = tours + entertainment + shopping + miscellaneous;

    // Grand total
    const grandTotal = transportTotal + accommodationTotal + foodTotal + activitiesTotal;
    const costPerPerson = grandTotal / travelers;
    const dailyCost = costPerPerson / tripDays;

    // Determine budget level
    let budgetLevel = 'Moderate Budget';
    let budgetColor = 'text-blue-600';
    if (dailyCost < 100) {
      budgetLevel = 'Budget-Friendly';
      budgetColor = 'text-green-600';
    } else if (dailyCost > 300) {
      budgetLevel = 'Luxury Travel';
      budgetColor = 'text-purple-600';
    } else if (dailyCost > 200) {
      budgetLevel = 'Premium Travel';
      budgetColor = 'text-orange-600';
    }

    // Category breakdown
    const categories: CategoryBreakdown[] = [
      { name: 'Transportation', total: transportTotal, color: 'bg-blue-500', icon: '🚗' },
      { name: 'Accommodation', total: accommodationTotal, color: 'bg-green-500', icon: '🏨' },
      { name: 'Food & Dining', total: foodTotal, color: 'bg-orange-500', icon: '🍽️' },
      { name: 'Activities & Other', total: activitiesTotal, color: 'bg-purple-500', icon: '🎯' }
    ];

    // Generate smart tips
    const tips: string[] = [];
    const transportPct = (transportTotal / grandTotal) * 100;
    const accomPct = (accommodationTotal / grandTotal) * 100;
    const foodPct = (foodTotal / grandTotal) * 100;

    if (transportPct > 40) {
      tips.push('Transportation is a major expense - consider flexible flight dates or alternative airports');
    }
    if (accomPct > 45) {
      tips.push('Accommodation costs are high - explore Airbnb or hostels as alternatives');
    }
    if (foodPct > 35) {
      tips.push('Food budget is generous - consider mixing restaurant meals with grocery shopping');
    }
    if (dailyCost > 250) {
      tips.push('Consider traveling during off-season for 30-50% savings');
    }
    tips.push('Book flights and hotels 2-3 months in advance for best prices');
    tips.push('Use public transportation to save 70-80% on local travel');

    setResults({
      grandTotal,
      costPerPerson,
      dailyCost,
      budgetLevel,
      budgetColor,
      transportTotal,
      accommodationTotal,
      foodTotal,
      activitiesTotal,
      totalFlights,
      totalDailyFood,
      categories,
      tips
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Add JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />

      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
          <Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</Link>
          <span className="text-gray-400">›</span>
          <span className="text-gray-600">Trip Cost Calculator</span>
        </div>

        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Trip Cost Calculator')}</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Plan your perfect vacation with detailed budget analysis, cost breakdowns, and money-saving recommendations</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
          {/* Calculator Form - Left Column (2/3) */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Basic Trip Information */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">✈️</span> Trip Overview
              </h2>

              <div className="space-y-4">
                <div>
                  <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">Destination</label>
                  <input
                    type="text"
                    id="destination"
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    placeholder="e.g., Paris, France"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tripDays" className="block text-sm font-medium text-gray-700 mb-2">Trip Duration (days)</label>
                    <input
                      type="number"
                      id="tripDays"
                      className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                      value={tripDays}
                      min={1}
                      max={365}
                      onChange={(e) => setTripDays(Number(e.target.value))}
                    />
                  </div>
                  <div>
                    <label htmlFor="travelers" className="block text-sm font-medium text-gray-700 mb-2">Number of Travelers</label>
                    <input
                      type="number"
                      id="travelers"
                      className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                      value={travelers}
                      min={1}
                      max={50}
                      onChange={(e) => setTravelers(Number(e.target.value))}
                    />
                  </div>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Transportation Costs */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🚗</span> Transportation
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="flightCost" className="block text-sm font-medium text-gray-700 mb-2">Round-trip Flight (per person)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="flightCost"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={flightCost}
                        min={0}
                        onChange={(e) => setFlightCost(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="airportTransfer" className="block text-sm font-medium text-gray-700 mb-2">Airport Transfers (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="airportTransfer"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={airportTransfer}
                        min={0}
                        onChange={(e) => setAirportTransfer(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="carRental" className="block text-sm font-medium text-gray-700 mb-2">Car Rental (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="carRental"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={carRental}
                        min={0}
                        onChange={(e) => setCarRental(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="localTransport" className="block text-sm font-medium text-gray-700 mb-2">Local Transport (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="localTransport"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={localTransport}
                        min={0}
                        onChange={(e) => setLocalTransport(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Accommodation */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🏨</span> Accommodation
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="hotelCost" className="block text-sm font-medium text-gray-700 mb-2">Hotel Cost (per night)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="hotelCost"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={hotelCost}
                        min={0}
                        onChange={(e) => setHotelCost(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="hotelFees" className="block text-sm font-medium text-gray-700 mb-2">Hotel Fees & Taxes (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="hotelFees"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={hotelFees}
                        min={0}
                        onChange={(e) => setHotelFees(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
{/* Food & Dining */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🍽️</span> Food & Dining
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="dailyFood" className="block text-sm font-medium text-gray-700 mb-2">Daily Food (per person)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="dailyFood"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={dailyFood}
                        min={0}
                        onChange={(e) => setDailyFood(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="specialDining" className="block text-sm font-medium text-gray-700 mb-2">Special Dining (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="specialDining"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={specialDining}
                        min={0}
                        onChange={(e) => setSpecialDining(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="groceries" className="block text-sm font-medium text-gray-700 mb-2">Groceries & Snacks (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="groceries"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={groceries}
                        min={0}
                        onChange={(e) => setGroceries(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="drinks" className="block text-sm font-medium text-gray-700 mb-2">Drinks & Bar (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="drinks"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={drinks}
                        min={0}
                        onChange={(e) => setDrinks(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities & Entertainment */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-2xl">🎯</span> Activities & Entertainment
              </h2>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="tours" className="block text-sm font-medium text-gray-700 mb-2">Tours & Attractions (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="tours"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={tours}
                        min={0}
                        onChange={(e) => setTours(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="entertainment" className="block text-sm font-medium text-gray-700 mb-2">Entertainment (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="entertainment"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={entertainment}
                        min={0}
                        onChange={(e) => setEntertainment(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="shopping" className="block text-sm font-medium text-gray-700 mb-2">Shopping & Souvenirs (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="shopping"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={shopping}
                        min={0}
                        onChange={(e) => setShopping(Number(e.target.value))}
                      />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="miscellaneous" className="block text-sm font-medium text-gray-700 mb-2">Miscellaneous & Emergency (total)</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                      <input
                        type="number"
                        id="miscellaneous"
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                        value={miscellaneous}
                        min={0}
                        onChange={(e) => setMiscellaneous(Number(e.target.value))}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Panel - Right Column (1/3) */}
          <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Total Cost - Primary Result */}
            <div className="bg-blue-50 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <div className="text-center">
                <div className="text-xs text-gray-600 mb-2">💰 Total Trip Cost</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900 mb-1">{formatCurrency(results.grandTotal)}</div>
                <div className={`text-xs ${results.budgetColor} font-semibold`}>{results.budgetLevel}</div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h3 className="text-base font-medium text-gray-800 mb-4">📊 Cost Summary</h3>

              <div className="space-y-3">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Cost Per Person</div>
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(results.costPerPerson)}</div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-xs text-gray-600 mb-1">Daily Cost Per Person</div>
                  <div className="text-xl font-semibold text-gray-900">{formatCurrency(results.dailyCost)}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Duration</div>
                    <div className="text-base font-semibold text-gray-900">{tripDays} {tripDays === 1 ? 'day' : 'days'}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-600 mb-1">Travelers</div>
                    <div className="text-base font-semibold text-gray-900">{travelers} {travelers === 1 ? 'person' : 'people'}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Category Breakdown */}
            <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h3 className="text-base font-medium text-gray-800 mb-4">📈 Category Breakdown</h3>

              <div className="space-y-3">
                {results.categories.map((cat, index) => {
                  const percentage = ((cat.total / results.grandTotal) * 100).toFixed(0);
                  return (
                    <div key={index} className={`bg-${cat.color}-50 rounded-lg p-3`}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm font-medium text-gray-700">{cat.icon} {cat.name}</span>
                        <span className="text-xs font-semibold text-gray-600">{percentage}%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(cat.total)}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Budget Tips */}
            <div className="bg-amber-50 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
              <h3 className="text-base font-medium text-gray-800 mb-3">💡 Smart Tips</h3>
              <div className="space-y-2 text-sm text-gray-700">
                {results.tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">•</span>
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Cost Breakdown */}
        <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">📋 Detailed Cost Breakdown</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Transportation Details */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h3 className="text-base font-medium text-gray-800 mb-3">🚗 Transportation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Flights:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(flightCost * travelers)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Airport Transfers:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(airportTransfer)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Car Rental:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(carRental)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Local Transport:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(localTransport)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-medium text-gray-800">Total Transport:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(results.transportTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Accommodation Details */}
              <div className="bg-green-50 rounded-lg p-5">
                <h3 className="text-base font-medium text-gray-800 mb-3">🏨 Accommodation</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hotel (per night):</span>
                    <span className="font-medium text-gray-900">{formatCurrency(hotelCost)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Nights:</span>
                    <span className="font-medium text-gray-900">{tripDays}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Hotel Subtotal:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(hotelCost * tripDays)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Fees & Taxes:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(hotelFees)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-medium text-gray-800">Total Accommodation:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(results.accommodationTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Food Details */}
              <div className="bg-orange-50 rounded-lg p-5">
                <h3 className="text-base font-medium text-gray-800 mb-3">🍽️ Food & Dining</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Food Budget:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(dailyFood * travelers * tripDays)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Special Dining:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(specialDining)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Groceries & Snacks:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(groceries)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Drinks & Bar:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(drinks)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-medium text-gray-800">Total Food:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(results.foodTotal)}</span>
                  </div>
                </div>
              </div>

              {/* Activities Details */}
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-base font-medium text-gray-800 mb-3">🎯 Activities & Other</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tours & Attractions:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(tours)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Entertainment:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(entertainment)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shopping:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(shopping)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Miscellaneous:</span>
                    <span className="font-medium text-gray-900">{formatCurrency(miscellaneous)}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 mt-2">
                    <span className="font-medium text-gray-800">Total Activities:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(results.activitiesTotal)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Travel Planning Tips */}
        <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-teal-50 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">💰 Money-Saving Travel Tips</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              {/* Booking & Planning */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">📅 Booking & Planning</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Book Early:</strong> Flights and hotels are typically 20-30% cheaper 2-3 months in advance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Off-Season Travel:</strong> Visit during shoulder season for 30-50% savings on accommodation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Flexible Dates:</strong> Flying mid-week (Tue-Thu) is usually cheaper than weekends</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-blue-600 mt-1">•</span>
                      <span><strong>Price Alerts:</strong> Set up fare alerts on Google Flights or Kayak for best deals</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-800 mb-2">🏨 Accommodation</h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Alternative Lodging:</strong> Consider Airbnb, hostels, or vacation rentals for savings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Location Trade-off:</strong> Stay slightly outside city center and use public transport</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Free Breakfast:</strong> Hotels with included breakfast save $10-20 per person daily</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">•</span>
                      <span><strong>Loyalty Programs:</strong> Join hotel rewards programs for discounts and free nights</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🍽️</span> Food & Dining
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span><strong>Mix It Up:</strong> Balance restaurant meals with grocery shopping and picnics</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span><strong>Lunch Specials:</strong> Eat your big meal at lunch when restaurants offer deals</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span><strong>Local Markets:</strong> Shop at local markets for fresh, cheap food</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-600 mt-1">•</span>
                      <span><strong>Water Bottle:</strong> Bring refillable bottle to save $3-5 per person daily</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Transportation & Activities */}
              <div className="space-y-4">
                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🚌</span> Transportation
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span><strong>Public Transit:</strong> Use buses and metro instead of taxis (save 70-80%)</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span><strong>City Passes:</strong> Buy multi-day transit passes for unlimited travel</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span><strong>Walking Tours:</strong> Walk when possible - it's free and you see more</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-purple-600 mt-1">•</span>
                      <span><strong>Ride Sharing:</strong> Split Uber/Lyft rides with other travelers</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">🎯</span> Activities & Attractions
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 mt-1">•</span>
                      <span><strong>Free Attractions:</strong> Research free museums, parks, and walking tours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 mt-1">•</span>
                      <span><strong>City Tourist Cards:</strong> Consider passes that bundle attractions and transit</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 mt-1">•</span>
                      <span><strong>Free Days:</strong> Many museums have free admission days or hours</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-pink-600 mt-1">•</span>
                      <span><strong>Local Events:</strong> Check for free local festivals and events during your visit</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-white rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <span className="text-xl">💡</span> General Tips
                  </h3>
                  <ul className="space-y-2 text-sm text-gray-700">
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span><strong>Travel Insurance:</strong> Protect yourself from unexpected cancellations or medical costs</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span><strong>Credit Card Rewards:</strong> Use travel credit cards for points and no foreign fees</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span><strong>Emergency Fund:</strong> Set aside 10-15% extra for unexpected expenses</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-indigo-600 mt-1">•</span>
                      <span><strong>Track Spending:</strong> Use apps like Trail Wallet to monitor daily expenses</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Budget Guide */}
        <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Travel Budget Guidelines
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              {/* Budget Travel */}
              <div className="bg-green-50 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>💚</span> Budget Travel
                </h3>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">$50-100</div>
                <div className="text-sm text-gray-600 mb-4">per person, per day</div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Accommodation:</span>
                    <span className="font-semibold">$20-40</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span className="font-semibold">$15-30</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span className="font-semibold">$10-20</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="font-semibold">$5-10</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Hostels, street food, free activities, public transport
                  </div>
                </div>
              </div>

              {/* Moderate Travel */}
              <div className="bg-blue-50 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>💙</span> Moderate Travel
                </h3>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">$150-250</div>
                <div className="text-sm text-gray-600 mb-4">per person, per day</div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Accommodation:</span>
                    <span className="font-semibold">$60-100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span className="font-semibold">$40-70</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span className="font-semibold">$30-50</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="font-semibold">$20-30</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Mid-range hotels, restaurant dining, paid tours, mix of transport
                  </div>
                </div>
              </div>

              {/* Luxury Travel */}
              <div className="bg-purple-50 rounded-lg p-5">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <span>💜</span> Luxury Travel
                </h3>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-2">$300+</div>
                <div className="text-sm text-gray-600 mb-4">per person, per day</div>
                <div className="space-y-2 text-sm text-gray-700">
                  <div className="flex justify-between">
                    <span>Accommodation:</span>
                    <span className="font-semibold">$150-300+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Food:</span>
                    <span className="font-semibold">$80-150+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Activities:</span>
                    <span className="font-semibold">$50-100+</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transport:</span>
                    <span className="font-semibold">$20-50+</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-600">
                    Luxury hotels, fine dining, private tours, taxis and car service
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">💡 Budget Allocation Guide</h4>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">30-40%</div>
                  <div className="text-xs text-gray-600">Accommodation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">25-35%</div>
                  <div className="text-xs text-gray-600">Transportation</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">20-30%</div>
                  <div className="text-xs text-gray-600">Food</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">15-20%</div>
                  <div className="text-xs text-gray-600">Activities</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">5-10%</div>
                  <div className="text-xs text-gray-600">Miscellaneous</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content */}
        <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Plan Your Perfect Trip Budget</h2>
            <div className="prose max-w-none text-gray-700">
              <p className="mb-4">
                Planning a trip requires careful budgeting across transportation, accommodation, food, and activities.
                Our comprehensive trip cost calculator helps you estimate expenses and provides money-saving tips to make
                your vacation affordable. Whether you're planning a budget backpacking trip or a luxury vacation,
                understanding your costs helps you travel with confidence.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Breaking Down Travel Costs</h3>
              <p className="mb-4">
                Transportation typically accounts for 25-35% of a trip budget, including flights, car rentals, and local transit. Accommodation takes another 30-40%, varying dramatically between hostels, mid-range hotels, and luxury resorts. Food and activities split the remaining budget—allocate 10-15% for an emergency fund to handle unexpected expenses.
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-3">Timing Your Trip for Savings</h3>
              <p className="mb-4">
                Shoulder seasons (spring and fall) often offer 20-40% savings over peak summer or holiday periods. Booking flights 6-8 weeks ahead and hotels 3-4 weeks ahead typically yields the best rates. Tuesday and Wednesday flights are generally cheapest, while Sunday returns tend to be most expensive.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="max-w-[1180px] mx-auto px-2 mb-4 sm:mb-6 md:mb-8">
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
            <div className="space-y-5">
              <div className="border-b border-gray-100 pb-5">
                <h3 className="text-base font-medium text-gray-800 mb-2">How much should I budget per day for travel?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Daily budgets vary by destination and travel style. Budget travelers can manage on $50-100/day in affordable destinations (Southeast Asia, Eastern Europe), while mid-range travel in Western Europe or Japan typically runs $150-250/day. Major cities like London, Paris, or Tokyo require $200-400+/day for comfortable travel with dining and attractions.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-5">
                <h3 className="text-base font-medium text-gray-800 mb-2">What percentage of my trip budget should go to flights?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Flights typically represent 25-40% of a total trip budget for international travel. Shorter trips tend toward the higher percentage since flight costs are fixed regardless of trip length. For a 2-week Europe trip, aim for flights under 30% of budget. Use flexible date searches and consider budget airlines or connecting flights to reduce this ratio.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-5">
                <h3 className="text-base font-medium text-gray-800 mb-2">Should I book accommodations or activities in advance?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Book popular hotels and must-see attractions 2-4 weeks ahead, especially during peak season. Flexible travelers can find last-minute hotel deals (apps like HotelTonight offer day-of discounts). Always book in advance for limited-availability experiences like Machu Picchu, Anne Frank House, or popular restaurant reservations. Balance pre-planning with flexibility for spontaneous discoveries.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-5">
                <h3 className="text-base font-medium text-gray-800 mb-2">How much emergency fund should I set aside?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Set aside 10-15% of your total budget for unexpected expenses—flight delays, medical issues, lost items, or spontaneous opportunities. Keep at least $200-500 accessible in local currency or a backup card. Travel insurance (typically $50-150 for a 2-week trip) can protect against major financial losses from trip cancellations or medical emergencies abroad.
                </p>
              </div>
              <div className="border-b border-gray-100 pb-5">
                <h3 className="text-base font-medium text-gray-800 mb-2">Is it cheaper to exchange currency at home or abroad?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  ATMs abroad typically offer the best exchange rates—withdraw larger amounts less frequently to minimize per-transaction fees. Avoid airport currency exchanges and hotel desks, which charge 10-15% premiums. Credit cards with no foreign transaction fees are ideal for larger purchases. Bring a small amount of local currency ($50-100 equivalent) for arrival expenses.
                </p>
              </div>
              <div>
                <h3 className="text-base font-medium text-gray-800 mb-2">How can I track spending during my trip?</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Use travel budget apps like Trail Wallet, TravelSpend, or Splitwise (for group trips) to log expenses in real-time. Set daily spending limits and review totals each evening. Many credit card apps provide instant notifications and currency conversion. Keep receipts for the first few days to calibrate your estimates, then track major expenses and estimate small ones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Finance Calculators</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {relatedCalculators.map((calc) => (
              <Link key={calc.href} href={calc.href} className="group">
                <div className="rounded-lg p-4 bg-white border hover:border-blue-300 hover:shadow-md transition-all">
                  <div className="text-2xl mb-2">🧮</div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600">{calc.title}</h3>
                  <p className="text-xs text-gray-600">{calc.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="trip-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
