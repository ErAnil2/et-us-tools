'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface PropertyFeatures {
  garage: boolean;
  pool: boolean;
  fireplace: boolean;
  updated: boolean;
}

interface CalculationResults {
  estimatedValue: number;
  valueRange: { low: number; high: number };
  baseValue: number;
  pricePerSqFt: number;
  adjustments: number;
}

const typeMultipliers: { [key: string]: number } = {
  'single-family': 1.0,
  'condo': 0.85,
  'townhouse': 0.92,
  'multi-family': 1.1,
};

const conditionMultipliers: { [key: string]: number } = {
  'poor': 0.80,
  'fair': 0.90,
  'good': 1.0,
  'excellent': 1.15,
};

const neighborhoodMultipliers: { [key: string]: number } = {
  'below-average': 0.85,
  'average': 1.0,
  'above-average': 1.15,
  'premium': 1.30,
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Home Value Calculator?",
    answer: "A Home Value Calculator is a free online tool designed to help you quickly and accurately calculate home value-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Home Value Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Home Value Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Home Value Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HomeValueCalculatorClient() {
  const [squareFootage, setSquareFootage] = useState<number>(2000);
  const [lotSize, setLotSize] = useState<number>(8000);
  const [bedrooms, setBedrooms] = useState<number>(3);
  const [bathrooms, setBathrooms] = useState<number>(2);
  const [yearBuilt, setYearBuilt] = useState<number>(2000);
  const [propertyType, setPropertyType] = useState<string>('single-family');
  const [condition, setCondition] = useState<string>('good');
  const [comparablePrice, setComparablePrice] = useState<number>(200);
  const [neighborhood, setNeighborhood] = useState<string>('average');
  const [features, setFeatures] = useState<PropertyFeatures>({
    garage: false,
    pool: false,
    fireplace: false,
    updated: false,
  });

  const [results, setResults] = useState<CalculationResults | null>(null);
  const [scenarios, setScenarios] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    calculateHomeValue();
  }, [
    squareFootage,
    lotSize,
    bedrooms,
    bathrooms,
    yearBuilt,
    propertyType,
    condition,
    comparablePrice,
    neighborhood,
    features,
  ]);

  useEffect(() => {
    // Load Chart.js dynamically
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/chart.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const calculateHomeValue = () => {
    // Calculate base value from comparable price
    let baseValue = squareFootage * comparablePrice;

    // Age adjustment
    const currentYear = new Date().getFullYear();
    const age = currentYear - yearBuilt;
    let ageAdjustment = 1.0;
    if (age > 30) ageAdjustment = 0.90;
    else if (age > 20) ageAdjustment = 0.95;
    else if (age > 10) ageAdjustment = 0.98;
    else if (age < 5) ageAdjustment = 1.05;

    // Lot size adjustment
    let lotAdjustment = 1.0;
    if (lotSize > 15000) lotAdjustment = 1.10;
    else if (lotSize > 10000) lotAdjustment = 1.05;
    else if (lotSize < 5000) lotAdjustment = 0.95;

    // Feature adjustments
    let featureBonus = 0;
    if (features.garage) featureBonus += 0.05;
    if (features.pool) featureBonus += 0.04;
    if (features.fireplace) featureBonus += 0.03;
    if (features.updated) featureBonus += 0.08;

    // Apply all adjustments
    let adjustedValue = baseValue;
    adjustedValue *= ageAdjustment;
    adjustedValue *= typeMultipliers[propertyType];
    adjustedValue *= conditionMultipliers[condition];
    adjustedValue *= neighborhoodMultipliers[neighborhood];
    adjustedValue *= lotAdjustment;
    adjustedValue *= (1 + featureBonus);

    // Calculate range (±10%)
    const lowValue = adjustedValue * 0.90;
    const highValue = adjustedValue * 1.10;

    // Calculate adjustments total
    const totalAdjustments = adjustedValue - baseValue;

    const newResults: CalculationResults = {
      estimatedValue: adjustedValue,
      valueRange: { low: lowValue, high: highValue },
      baseValue: baseValue,
      pricePerSqFt: adjustedValue / squareFootage,
      adjustments: totalAdjustments,
    };

    setResults(newResults);

    // Update scenarios
    updateScenarios(squareFootage, adjustedValue, comparablePrice, condition, features);

    // Update chart
    updateChart(baseValue, totalAdjustments, adjustedValue);
  };

  const updateScenarios = (
    sqft: number,
    currentValue: number,
    compPrice: number,
    cond: string,
    feats: PropertyFeatures
  ) => {
    // Scenario 1: Add 500 sq ft
    const scenario1Value = (sqft + 500) * compPrice;
    const scenario1Gain = scenario1Value - currentValue;

    // Scenario 2: Upgrade to excellent condition
    let scenario2Value = currentValue;
    if (cond !== 'excellent') {
      scenario2Value = currentValue * (1.15 / conditionMultipliers[cond]);
    }
    const scenario2Gain = scenario2Value - currentValue;

    // Scenario 3: Add premium features
    let scenario3Value = currentValue;
    if (!feats.pool) scenario3Value *= 1.04;
    if (!feats.garage) scenario3Value *= 1.05;
    const scenario3Gain = scenario3Value - currentValue;

    setScenarios({
      scenario1: {
        value: scenario1Value,
        gain: scenario1Gain,
        newSqft: sqft + 500,
      },
      scenario2: {
        value: scenario2Value,
        gain: scenario2Gain,
      },
      scenario3: {
        value: scenario3Value,
        gain: scenario3Gain,
      },
    });
  };

  const updateChart = (baseValue: number, adjustments: number, totalValue: number) => {
    if (typeof window === 'undefined' || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Check if Chart is available
    if (!(window as any).Chart) {
      setTimeout(() => updateChart(baseValue, adjustments, totalValue), 100);
      return;
    }

    if (chartRef.current) {
      chartRef.current.destroy();
    }

    const Chart = (window as any).Chart;

    const data = {
      labels: ['Base Value', 'Adjustments', 'Final Value'],
      datasets: [
        {
          label: 'Home Value Breakdown',
          data: [baseValue, Math.abs(adjustments), totalValue],
          backgroundColor: ['#60A5FA', '#34D399', '#8B5CF6'],
          borderColor: ['#3B82F6', '#10B981', '#7C3AED'],
          borderWidth: 2,
        },
      ],
    };

    try {
      chartRef.current = new Chart(ctx, {
        type: 'bar',
        data: data,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                callback: function (value: any) {
                  return '$' + value.toLocaleString();
                },
              },
            },
          },
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: 'Value Breakdown',
            },
          },
        },
      });
    } catch (error) {
      console.error('Chart creation failed:', error);
    }
  };

  const applyTemplate = (
    sqft: number,
    lot: number,
    beds: number,
    baths: number,
    year: number,
    comp: number
  ) => {
    setSquareFootage(sqft);
    setLotSize(lot);
    setBedrooms(beds);
    setBathrooms(baths);
    setYearBuilt(year);
    setComparablePrice(comp);
  };

  const handleFeatureChange = (feature: keyof PropertyFeatures) => {
    setFeatures((prev) => ({
      ...prev,
      [feature]: !prev[feature],
    }));
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 sm:px-2 py-3 sm:py-4 md:py-6">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">Home Value Calculator</h1>
        <p className="text-base sm:text-lg text-gray-600">
          Estimate your property&apos;s current market value using comparable sales and key features
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Home Value Calculator</h2>

            {/* Property Scenarios */}
            <div className="mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg font-medium text-gray-700 mb-3">Property Types</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => applyTemplate(2000, 8000, 3, 2, 2000, 200)}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Single Family Home
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(1200, 0, 2, 2, 2010, 250)}
                  className="bg-green-100 hover:bg-green-200 text-green-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Modern Condo
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(1800, 4000, 3, 2.5, 2005, 220)}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Townhouse
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(3500, 12000, 5, 3.5, 1995, 300)}
                  className="bg-orange-100 hover:bg-orange-200 text-orange-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Luxury Home
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(1000, 6000, 2, 1, 1980, 150)}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  Starter Home
                </button>
                <button
                  type="button"
                  onClick={() => applyTemplate(2800, 10000, 4, 3, 2015, 275)}
                  className="bg-teal-100 hover:bg-teal-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                >
                  New Construction
                </button>
              </div>
            </div>

            {/* Basic Property Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-gray-700">Property Details</h3>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
                    Square Footage
                  </label>
                  <input
                    type="number"
                    id="squareFootage"
                    min="500"
                    value={squareFootage}
                    onChange={(e) => setSquareFootage(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="lotSize" className="block text-sm font-medium text-gray-700 mb-1">
                    Lot Size (sq ft)
                  </label>
                  <input
                    type="number"
                    id="lotSize"
                    min="0"
                    value={lotSize}
                    onChange={(e) => setLotSize(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms
                  </label>
                  <select
                    id="bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms
                  </label>
                  <select
                    id="bathrooms"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(parseFloat(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="1">1</option>
                    <option value="1.5">1.5</option>
                    <option value="2">2</option>
                    <option value="2.5">2.5</option>
                    <option value="3">3</option>
                    <option value="3.5">3.5</option>
                    <option value="4">4+</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="yearBuilt" className="block text-sm font-medium text-gray-700 mb-1">
                    Year Built
                  </label>
                  <input
                    type="number"
                    id="yearBuilt"
                    min="1900"
                    max="2024"
                    value={yearBuilt}
                    onChange={(e) => setYearBuilt(parseInt(e.target.value) || 2000)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="propertyType" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type
                  </label>
                  <select
                    id="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="single-family">Single Family</option>
                    <option value="condo">Condominium</option>
                    <option value="townhouse">Townhouse</option>
                    <option value="multi-family">Multi-Family</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-1">
                    Condition
                  </label>
                  <select
                    id="condition"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="poor">Poor</option>
                    <option value="fair">Fair</option>
                    <option value="good">Good</option>
                    <option value="excellent">Excellent</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="comparablePrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Comparable Price ($/sq ft)
                  </label>
                  <input
                    type="number"
                    id="comparablePrice"
                    min="50"
                    value={comparablePrice}
                    onChange={(e) => setComparablePrice(parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="neighborhood" className="block text-sm font-medium text-gray-700 mb-1">
                    Neighborhood
                  </label>
                  <select
                    id="neighborhood"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="below-average">Below Average</option>
                    <option value="average">Average</option>
                    <option value="above-average">Above Average</option>
                    <option value="premium">Premium</option>
                  </select>
                </div>
              </div>

              {/* Features */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Features</label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={features.garage}
                      onChange={() => handleFeatureChange('garage')}
                      className="mr-2"
                    />
                    <span className="text-sm">Garage</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={features.pool}
                      onChange={() => handleFeatureChange('pool')}
                      className="mr-2"
                    />
                    <span className="text-sm">Pool</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={features.fireplace}
                      onChange={() => handleFeatureChange('fireplace')}
                      className="mr-2"
                    />
                    <span className="text-sm">Fireplace</span>
                  </label>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={features.updated}
                      onChange={() => handleFeatureChange('updated')}
                      className="mr-2"
                    />
                    <span className="text-sm">Recently Updated</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Calculate Button */}
            <button
              onClick={calculateHomeValue}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-3 sm:px-4 md:px-6 rounded-lg transition-colors"
            >
              Calculate Home Value
            </button>
          </div>

          {/* Results Section */}
          <div>
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Estimated Value</h3>

            {results && (
              <>
                {/* Main Value Display */}
                <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200 mb-3 sm:mb-4 md:mb-6">
                  <div className="text-center">
                    <div className="text-sm font-medium text-blue-600 mb-1">Estimated Home Value</div>
                    <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700 mb-2">
                      ${Math.round(results.estimatedValue).toLocaleString()}
                    </div>
                    <div className="text-sm text-blue-600">
                      ${Math.round(results.valueRange.low).toLocaleString()} - $
                      {Math.round(results.valueRange.high).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Value Breakdown */}
                <div className="grid grid-cols-1 gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="text-sm font-medium text-green-600">Base Value</div>
                    <div className="text-2xl font-bold text-green-700">
                      ${Math.round(results.baseValue).toLocaleString()}
                    </div>
                  </div>
                  <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                    <div className="text-sm font-medium text-purple-600">Price per Sq Ft</div>
                    <div className="text-2xl font-bold text-purple-700">
                      ${Math.round(results.pricePerSqFt)}
                    </div>
                  </div>
                  <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                    <div className="text-sm font-medium text-amber-600">Value Adjustments</div>
                    <div className="text-2xl font-bold text-amber-700">
                      {results.adjustments >= 0 ? '+' : ''}${Math.round(results.adjustments).toLocaleString()}
                    </div>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-6">
                  <canvas ref={canvasRef} width="400" height="200"></canvas>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* What If Scenarios */}
      {scenarios && results && (
        <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">What If Scenarios</h2>
          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {/* Scenario 1 */}
            <div className="p-3 sm:p-4 md:p-6 bg-blue-50 rounded-xl border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Add 500 Sq Ft</h3>
              <div className="space-y-2">
                <div className="text-sm text-blue-700">
                  Expand to <span className="font-semibold">{scenarios.scenario1.newSqft.toLocaleString()} sq ft</span>
                </div>
                <div className="text-lg font-bold text-blue-800">
                  Value: ${Math.round(scenarios.scenario1.value).toLocaleString()}
                </div>
                <div className="text-sm text-blue-600">
                  +${Math.round(Math.abs(scenarios.scenario1.gain)).toLocaleString()} increase
                </div>
              </div>
            </div>

            {/* Scenario 2 */}
            <div className="p-3 sm:p-4 md:p-6 bg-green-50 rounded-xl border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Major Renovation</h3>
              <div className="space-y-2">
                <div className="text-sm text-green-700">
                  Upgrade to <span className="font-semibold">excellent condition</span>
                </div>
                <div className="text-lg font-bold text-green-800">
                  Value: ${Math.round(scenarios.scenario2.value).toLocaleString()}
                </div>
                <div className="text-sm text-green-600">
                  +${Math.round(Math.abs(scenarios.scenario2.gain)).toLocaleString()} increase
                </div>
              </div>
            </div>

            {/* Scenario 3 */}
            <div className="p-3 sm:p-4 md:p-6 bg-purple-50 rounded-xl border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Premium Features</h3>
              <div className="space-y-2">
                <div className="text-sm text-purple-700">
                  Add <span className="font-semibold">pool + garage</span>
                </div>
                <div className="text-lg font-bold text-purple-800">
                  Value: ${Math.round(scenarios.scenario3.value).toLocaleString()}
                </div>
                <div className="text-sm text-purple-600">
                  +${Math.round(Math.abs(scenarios.scenario3.gain)).toLocaleString()} increase
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Analysis */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Market Analysis &amp; Tips</h2>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Value Factors</h3>
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">Location (40% of value)</h4>
                <p className="text-sm text-blue-700">Neighborhood quality, schools, amenities, and market trends.</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">Size &amp; Layout (30% of value)</h4>
                <p className="text-sm text-green-700">Square footage, lot size, bedrooms, and bathrooms.</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-2">Condition &amp; Age (20% of value)</h4>
                <p className="text-sm text-purple-700">Property condition, age, and recent updates.</p>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg">
                <h4 className="font-semibold text-orange-800 mb-2">Features (10% of value)</h4>
                <p className="text-sm text-orange-700">Special features like pools, garages, and upgrades.</p>
              </div>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-medium text-gray-700 mb-3">Increasing Home Value</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Kitchen Remodel:</span>
                  <span className="text-sm ml-1">70-80% ROI</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Bathroom Updates:</span>
                  <span className="text-sm ml-1">60-70% ROI</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Curb Appeal:</span>
                  <span className="text-sm ml-1">100%+ ROI</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Energy Efficiency:</span>
                  <span className="text-sm ml-1">50-80% ROI</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Finished Basement:</span>
                  <span className="text-sm ml-1">70-75% ROI</span>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-2">✓</span>
                <div>
                  <span className="font-semibold">Deck Addition:</span>
                  <span className="text-sm ml-1">65-75% ROI</span>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="home-value-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* Disclaimer */}
      <div className="bg-gray-50 rounded-xl p-3 sm:p-4 md:p-6 text-center">
        <p className="text-sm text-gray-600">
          <strong>Disclaimer:</strong> This calculator provides estimates for educational purposes. Actual home values
          may vary based on market conditions, unique property features, and buyer demand. Consider getting a
          professional appraisal for accurate valuations.
        </p>
      </div>
    </div>
  );
}
