'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Fuel Economy Calculator?",
    answer: "A Fuel Economy Calculator is a free online tool designed to help you quickly and accurately calculate fuel economy-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Fuel Economy Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Fuel Economy Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Fuel Economy Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function FuelEconomyCalculatorClient() {
  // MPG Calculator
  const [milesDriven, setMilesDriven] = useState<number>(300);
  const [fuelUsed, setFuelUsed] = useState<number>(10.5);
  const [fuelPrice, setFuelPrice] = useState<number>(3.50);
  const [mpgResult, setMpgResult] = useState<number>(0);
  const [costPerMile, setCostPerMile] = useState<number>(0);
  const [totalFuelCost, setTotalFuelCost] = useState<number>(0);
  const [efficiencyRating, setEfficiencyRating] = useState<string>('--');

  // Fuel Consumption Calculator
  const [distanceToTravel, setDistanceToTravel] = useState<number>(0);
  const [vehicleMPG, setVehicleMPG] = useState<number>(0);
  const [currentFuelPrice, setCurrentFuelPrice] = useState<number>(0);
  const [gallonsNeeded, setGallonsNeeded] = useState<number>(0);
  const [tripCost, setTripCost] = useState<number>(0);
  const [consumptionCostPerMile, setConsumptionCostPerMile] = useState<number>(0);

  // Trip Cost Calculator
  const [tripDistance, setTripDistance] = useState<number>(0);
  const [tripVehicleMPG, setTripVehicleMPG] = useState<number>(0);
  const [tripFuelPrice, setTripFuelPrice] = useState<number>(0);
  const [roundTrip, setRoundTrip] = useState<boolean>(false);
  const [totalTripCost, setTotalTripCost] = useState<number>(0);
  const [tripDistanceDisplay, setTripDistanceDisplay] = useState<number>(0);
  const [tripFuelNeeded, setTripFuelNeeded] = useState<number>(0);
  const [tripCostPerMile, setTripCostPerMile] = useState<number>(0);

  // Vehicle Comparison
  const [vehicle1Name, setVehicle1Name] = useState<string>('');
  const [vehicle1MPG, setVehicle1MPG] = useState<number>(0);
  const [vehicle2Name, setVehicle2Name] = useState<string>('');
  const [vehicle2MPG, setVehicle2MPG] = useState<number>(0);
  const [annualMiles, setAnnualMiles] = useState<number>(0);
  const [compareFuelPrice, setCompareFuelPrice] = useState<number>(0);
  const [comparisonHTML, setComparisonHTML] = useState<string>('<p class="text-gray-500 col-span-2 text-center py-4">Enter values for both vehicles to see comparison</p>');

  const formatNumber = (num: number, decimals: number = 2): number => {
    if (num === 0 || isNaN(num)) return 0;
    return parseFloat(num.toFixed(decimals));
  };

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  const calculateMPG = () => {
    if (milesDriven <= 0 || fuelUsed <= 0) {
      setMpgResult(0);
      setCostPerMile(0);
      setTotalFuelCost(0);
      setEfficiencyRating('--');
      return;
    }

    const mpg = milesDriven / fuelUsed;
    const costPer = (fuelUsed * fuelPrice) / milesDriven;
    const totalCost = fuelUsed * fuelPrice;

    setMpgResult(formatNumber(mpg, 1));
    setCostPerMile(costPer);
    setTotalFuelCost(totalCost);

    // Update efficiency rating
    let rating;
    if (mpg >= 40) rating = 'Excellent';
    else if (mpg >= 30) rating = 'Good';
    else if (mpg >= 20) rating = 'Average';
    else rating = 'Below Average';

    setEfficiencyRating(rating);
  };

  const calculateConsumption = () => {
    if (distanceToTravel <= 0 || vehicleMPG <= 0) {
      setGallonsNeeded(0);
      setTripCost(0);
      setConsumptionCostPerMile(0);
      return;
    }

    const gallons = distanceToTravel / vehicleMPG;
    const cost = gallons * currentFuelPrice;
    const costPer = currentFuelPrice / vehicleMPG;

    setGallonsNeeded(formatNumber(gallons, 1));
    setTripCost(cost);
    setConsumptionCostPerMile(costPer);
  };

  const calculateTripCost = () => {
    if (tripDistance <= 0 || tripVehicleMPG <= 0) {
      setTotalTripCost(0);
      setTripDistanceDisplay(0);
      setTripFuelNeeded(0);
      setTripCostPerMile(0);
      return;
    }

    const totalDistance = roundTrip ? tripDistance * 2 : tripDistance;
    const fuelNeeded = totalDistance / tripVehicleMPG;
    const totalCost = fuelNeeded * tripFuelPrice;
    const costPer = tripFuelPrice / tripVehicleMPG;

    setTotalTripCost(totalCost);
    setTripDistanceDisplay(formatNumber(totalDistance, 0));
    setTripFuelNeeded(formatNumber(fuelNeeded, 1));
    setTripCostPerMile(costPer);
  };

  const compareVehicles = () => {
    if (vehicle1MPG <= 0 || vehicle2MPG <= 0 || annualMiles <= 0) {
      setComparisonHTML('<p class="text-gray-500 col-span-2 text-center py-4">Enter values for both vehicles to see comparison</p>');
      return;
    }

    const vehicle1FuelCost = (annualMiles / vehicle1MPG) * compareFuelPrice;
    const vehicle2FuelCost = (annualMiles / vehicle2MPG) * compareFuelPrice;
    const savings = Math.abs(vehicle1FuelCost - vehicle2FuelCost);
    const betterVehicle = vehicle1FuelCost < vehicle2FuelCost ? (vehicle1Name || 'Vehicle 1') : (vehicle2Name || 'Vehicle 2');

    const html = `
      <div class="bg-blue-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">${vehicle1Name || 'Vehicle 1'}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">MPG:</span>
            <span class="font-semibold text-gray-900">${formatNumber(vehicle1MPG, 1)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Annual Cost:</span>
            <span class="font-semibold text-gray-900">${formatCurrency(vehicle1FuelCost)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Gallons/Year:</span>
            <span class="font-semibold text-gray-900">${formatNumber(annualMiles / vehicle1MPG, 0)}</span>
          </div>
        </div>
      </div>
      <div class="bg-green-50 rounded-lg p-4">
        <h4 class="font-semibold text-gray-800 mb-3">${vehicle2Name || 'Vehicle 2'}</h4>
        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600">MPG:</span>
            <span class="font-semibold text-gray-900">${formatNumber(vehicle2MPG, 1)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Annual Cost:</span>
            <span class="font-semibold text-gray-900">${formatCurrency(vehicle2FuelCost)}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600">Gallons/Year:</span>
            <span class="font-semibold text-gray-900">${formatNumber(annualMiles / vehicle2MPG, 0)}</span>
          </div>
        </div>
      </div>
      <div class="col-span-2 bg-yellow-50 rounded-lg p-4 text-center">
        <p class="text-sm text-gray-700"><strong>${betterVehicle}</strong> saves <strong>${formatCurrency(savings)}</strong> per year</p>
      </div>
    `;

    setComparisonHTML(html);
  };

  useEffect(() => {
    calculateMPG();
  }, [milesDriven, fuelUsed, fuelPrice]);

  useEffect(() => {
    calculateConsumption();
  }, [distanceToTravel, vehicleMPG, currentFuelPrice]);

  useEffect(() => {
    calculateTripCost();
  }, [tripDistance, tripVehicleMPG, tripFuelPrice, roundTrip]);

  useEffect(() => {
    compareVehicles();
  }, [vehicle1Name, vehicle1MPG, vehicle2Name, vehicle2MPG, annualMiles, compareFuelPrice]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <a href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</a>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">Fuel Economy Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Fuel Economy Calculator</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">Calculate MPG, fuel consumption, trip costs, and compare vehicles for better fuel efficiency</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Main Calculators - Left Column (2/3) */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">

          {/* MPG Calculator */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">⛽</span> Calculate Miles Per Gallon (MPG)
            </h2>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Miles Driven</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 320"
                    value={milesDriven}
                    onChange={(e) => setMilesDriven(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Used (gallons)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g., 12.5"
                    value={fuelUsed}
                    onChange={(e) => setFuelUsed(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price (per gallon)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 3.50"
                      value={fuelPrice}
                      onChange={(e) => setFuelPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Results</h3>

                <div className="bg-green-50 rounded-lg p-4 text-center mb-3">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900">{mpgResult}</div>
                  <div className="text-sm text-gray-600">Miles Per Gallon</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Per Mile:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(costPerMile)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Fuel Cost:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(totalFuelCost)}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Efficiency Rating:</span>
                    <span className="font-semibold text-gray-900">{efficiencyRating}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">💡 Measurement Tips</h4>
              <ul className="space-y-1 text-xs text-gray-700">
                <li>• Fill tank completely at start and end</li>
                <li>• Reset trip odometer after first fill-up</li>
                <li>• Use same gas station for consistency</li>
                <li>• Calculate over several fill-ups for accuracy</li>
              </ul>
            </div>
          </div>

          {/* Fuel Consumption Calculator */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📊</span> Calculate Fuel Consumption
            </h2>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Distance to Travel (miles)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 500"
                    value={distanceToTravel || ''}
                    onChange={(e) => setDistanceToTravel(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle MPG</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 28.5"
                    value={vehicleMPG || ''}
                    onChange={(e) => setVehicleMPG(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price (per gallon)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 3.50"
                      value={currentFuelPrice || ''}
                      onChange={(e) => setCurrentFuelPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Results</h3>

                <div className="space-y-3">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{gallonsNeeded}</div>
                    <div className="text-sm text-gray-600">Gallons Needed</div>
                  </div>

                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-2xl font-bold text-gray-900">{formatCurrency(tripCost)}</div>
                    <div className="text-sm text-gray-600">Total Trip Cost</div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Cost per mile:</span>
                      <span className="font-semibold text-gray-900">{formatCurrency(consumptionCostPerMile)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Trip Cost Calculator */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🚗</span> Calculate Trip Cost
            </h2>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trip Distance (miles)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 300"
                    value={tripDistance || ''}
                    onChange={(e) => setTripDistance(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Vehicle MPG</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 32"
                    value={tripVehicleMPG || ''}
                    onChange={(e) => setTripVehicleMPG(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price (per gallon)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      placeholder="e.g., 3.45"
                      value={tripFuelPrice || ''}
                      onChange={(e) => setTripFuelPrice(parseFloat(e.target.value) || 0)}
                      className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={roundTrip}
                      onChange={(e) => setRoundTrip(e.target.checked)}
                      className="mr-2 rounded"
                    />
                    <span className="text-sm font-medium text-gray-700">Round Trip</span>
                  </label>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Results</h3>

                <div className="bg-purple-50 rounded-lg p-4 text-center mb-3">
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">{formatCurrency(totalTripCost)}</div>
                  <div className="text-sm text-gray-600">Total Fuel Cost</div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Distance:</span>
                    <span className="font-semibold text-gray-900">{tripDistanceDisplay} miles</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Fuel Needed:</span>
                    <span className="font-semibold text-gray-900">{tripFuelNeeded} gal</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-600">Cost Per Mile:</span>
                    <span className="font-semibold text-gray-900">{formatCurrency(tripCostPerMile)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Vehicle Comparison */}
          <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">🔄</span> Compare Vehicles
            </h2>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Vehicle 1</h3>
                <input
                  type="text"
                  placeholder="e.g., Honda Civic"
                  value={vehicle1Name}
                  onChange={(e) => setVehicle1Name(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="MPG (e.g., 32)"
                  value={vehicle1MPG || ''}
                  onChange={(e) => setVehicle1MPG(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-700">Vehicle 2</h3>
                <input
                  type="text"
                  placeholder="e.g., Toyota Prius"
                  value={vehicle2Name}
                  onChange={(e) => setVehicle2Name(e.target.value)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
                <input
                  type="number"
                  step="0.1"
                  placeholder="MPG (e.g., 50)"
                  value={vehicle2MPG || ''}
                  onChange={(e) => setVehicle2MPG(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Annual Miles Driven</label>
                <input
                  type="number"
                  placeholder="e.g., 12000"
                  value={annualMiles || ''}
                  onChange={(e) => setAnnualMiles(parseFloat(e.target.value) || 0)}
                  className="w-full px-2 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fuel Price (per gallon)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 font-medium">$</span>
                  <input
                    type="number"
                    step="0.01"
                    placeholder="e.g., 3.50"
                    value={compareFuelPrice || ''}
                    onChange={(e) => setCompareFuelPrice(parseFloat(e.target.value) || 0)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 focus:ring-1 focus:ring-blue-400 focus:border-blue-400 transition-colors"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4" dangerouslySetInnerHTML={{ __html: comparisonHTML }} />
          </div>
        </div>

        {/* Sidebar - Right Column (1/3) */}
        <div className="lg:col-span-1 space-y-3 sm:space-y-4 md:space-y-6">
          {/* Vehicle Reference */}
          <div className="bg-blue-50 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fuel Economy Reference</h3>
            <div className="space-y-3">
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Compact Cars</h4>
                <p className="text-sm text-gray-600">30-40 MPG</p>
                <p className="text-xs text-gray-500">Civic, Corolla, Sentra</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Midsize Cars</h4>
                <p className="text-sm text-gray-600">25-35 MPG</p>
                <p className="text-xs text-gray-500">Camry, Accord, Altima</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">SUVs</h4>
                <p className="text-sm text-gray-600">20-30 MPG</p>
                <p className="text-xs text-gray-500">RAV4, CR-V, Escape</p>
              </div>
              <div className="bg-white rounded-lg p-3">
                <h4 className="font-semibold text-gray-800 text-sm mb-1">Hybrids</h4>
                <p className="text-sm text-gray-600">40-60 MPG</p>
                <p className="text-xs text-gray-500">Prius, Insight, Camry Hybrid</p>
              </div>
            </div>
          </div>

          {/* Fuel Economy Tips */}
          <div className="bg-green-50 rounded-lg shadow-sm p-3 sm:p-4 md:p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Fuel Saving Tips</h3>
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Driving Habits:</h4>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Maintain steady speeds</li>
                  <li>• Avoid rapid acceleration</li>
                  <li>• Use cruise control</li>
                  <li>• Remove excess weight</li>
                  <li>• Combine errands into trips</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 text-sm">Vehicle Maintenance:</h4>
                <ul className="space-y-1 text-xs text-gray-700">
                  <li>• Keep tires properly inflated</li>
                  <li>• Replace air filter regularly</li>
                  <li>• Use recommended motor oil</li>
                  <li>• Keep up with tune-ups</li>
                  <li>• Remove roof racks when unused</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="fuel-economy-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
