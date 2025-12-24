'use client';

import { useState, useEffect } from 'react';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import Link from 'next/link';
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

// Climate zone factors for cooling/heating
const climateFactors: Record<number, { cooling: number; heating: number }> = {
  1: { cooling: 35, heating: 15 }, // Very hot
  2: { cooling: 32, heating: 20 },
  3: { cooling: 28, heating: 25 },
  4: { cooling: 25, heating: 30 }, // Moderate
  5: { cooling: 22, heating: 35 },
  6: { cooling: 20, heating: 40 },
  7: { cooling: 18, heating: 45 }  // Very cold
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Hvac Load Calculator?",
    answer: "A Hvac Load Calculator is a free online tool designed to help you quickly and accurately calculate hvac load-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Hvac Load Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Hvac Load Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Hvac Load Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function HvacLoadCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('hvac-load-calculator');

  const [squareFootage, setSquareFootage] = useState<number>(2000);
  const [ceilingHeight, setCeilingHeight] = useState<number>(9);
  const [climateZone, setClimateZone] = useState<number>(4);
  const [homeType, setHomeType] = useState<string>('single');
  const [insulationLevel, setInsulationLevel] = useState<string>('average');
  const [windowCount, setWindowCount] = useState<string>('average');
  const [windowType, setWindowType] = useState<string>('double');
  const [sunExposure, setSunExposure] = useState<string>('medium');
  const [occupants, setOccupants] = useState<number>(4);
  const [resultsHTML, setResultsHTML] = useState<string>('');

  useEffect(() => {
    calculateHVACLoad();
  }, [squareFootage, ceilingHeight, climateZone, homeType, insulationLevel, windowCount, windowType, sunExposure, occupants]);

  const calculateHVACLoad = () => {
    if (squareFootage <= 0) {
      setResultsHTML('');
      return;
    }

    // Calculate cubic footage
    const cubicFootage = squareFootage * ceilingHeight;

    // Get base BTU per square foot based on climate
    const climateFactor = climateFactors[climateZone];
    let coolingBTU = squareFootage * climateFactor.cooling;
    let heatingBTU = squareFootage * climateFactor.heating;

    // Adjust for ceiling height
    const heightMultiplier = ceilingHeight > 9 ? 1 + ((ceilingHeight - 9) * 0.1) : 1;
    coolingBTU *= heightMultiplier;
    heatingBTU *= heightMultiplier;

    // Adjust for insulation level
    const insulationMultipliers: Record<string, { cooling: number; heating: number }> = {
      poor: { cooling: 1.3, heating: 1.4 },
      average: { cooling: 1.1, heating: 1.2 },
      good: { cooling: 1.0, heating: 1.0 },
      excellent: { cooling: 0.9, heating: 0.85 }
    };
    coolingBTU *= insulationMultipliers[insulationLevel].cooling;
    heatingBTU *= insulationMultipliers[insulationLevel].heating;

    // Adjust for home type
    const homeTypeMultipliers: Record<string, number> = {
      single: 1.0,
      townhouse: 0.9,
      condo: 0.8,
      mobile: 1.2
    };
    const homeMultiplier = homeTypeMultipliers[homeType] || 1.0;
    coolingBTU *= homeMultiplier;
    heatingBTU *= homeMultiplier;

    // Adjust for windows
    const windowMultipliers: Record<string, number> = {
      few: 0.9,
      average: 1.0,
      many: 1.2
    };
    coolingBTU *= windowMultipliers[windowCount];

    // Adjust for window type
    const windowTypeMultipliers: Record<string, number> = {
      single: 1.3,
      double: 1.0,
      triple: 0.85,
      lowE: 0.9
    };
    coolingBTU *= windowTypeMultipliers[windowType];
    heatingBTU *= windowTypeMultipliers[windowType];

    // Adjust for sun exposure
    const sunExposureMultipliers: Record<string, number> = {
      low: 0.9,
      medium: 1.0,
      high: 1.15
    };
    coolingBTU *= sunExposureMultipliers[sunExposure];

    // Add internal loads (people, appliances)
    const internalLoad = occupants * 400; // 400 BTU per person
    coolingBTU += internalLoad;

    // Round to nearest 1000
    coolingBTU = Math.round(coolingBTU / 1000) * 1000;
    heatingBTU = Math.round(heatingBTU / 1000) * 1000;

    // Convert to tons
    const coolingTons = coolingBTU / 12000;

    // Generate results HTML
    const html = `
      <div class="space-y-4">
        <!-- Cooling Requirements -->
        <div class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg border border-blue-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <span class="text-sm font-medium text-blue-900">Cooling Capacity</span>
          </div>
          <div class="text-3xl font-bold text-blue-700">${coolingBTU.toLocaleString()}</div>
          <div class="text-sm text-blue-600 mt-1">BTU/hr</div>
          <div class="text-lg font-semibold text-blue-800 mt-2">${coolingTons.toFixed(1)} Tons</div>
        </div>

        <!-- Heating Requirements -->
        <div class="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
            <span class="text-sm font-medium text-red-900">Heating Capacity</span>
          </div>
          <div class="text-3xl font-bold text-red-700">${heatingBTU.toLocaleString()}</div>
          <div class="text-sm text-red-600 mt-1">BTU/hr</div>
          <div class="text-lg font-semibold text-red-800 mt-2">${Math.round(heatingBTU * 0.000293)} kW</div>
        </div>

        <!-- System Recommendations -->
        <div class="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-green-900">AC Recommendation</span>
          </div>
          <div class="text-sm text-green-800">${getACRecommendation(coolingTons)}</div>
        </div>

        <div class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
          <div class="flex items-center mb-2">
            <svg class="w-5 h-5 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"></path>
            </svg>
            <span class="text-sm font-medium text-purple-900">Heating Recommendation</span>
          </div>
          <div class="text-sm text-purple-800">${getHeatingRecommendation(heatingBTU)}</div>
        </div>

        <!-- Cost Estimates -->
        <div class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
          <div class="flex items-center mb-3">
            <svg class="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-sm font-medium text-orange-900">Estimated Cost</span>
          </div>
          ${getCostEstimates(coolingTons, heatingBTU)}
        </div>

        <!-- Pro Tips -->
        <div class="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
          <div class="flex items-start">
            <svg class="w-5 h-5 text-yellow-600 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
            </svg>
            <div class="text-sm text-yellow-800">
              <strong>Pro Tip:</strong> Get a professional Manual J load calculation before purchasing. This calculator provides estimates; actual loads depend on many factors including ductwork, orientation, and local climate conditions.
            </div>
          </div>
        </div>
      </div>
    `;

    setResultsHTML(html);
  };

  const getACRecommendation = (coolingTons: number): string => {
    if (coolingTons <= 1.5) {
      return '1.5 ton central AC unit or ductless mini-split system';
    } else if (coolingTons <= 2.5) {
      return '2 to 2.5 ton central AC unit';
    } else if (coolingTons <= 3.5) {
      return '3 to 3.5 ton central AC unit';
    } else if (coolingTons <= 5) {
      return '4 to 5 ton central AC unit';
    } else {
      return 'Large commercial-grade system or multiple units';
    }
  };

  const getHeatingRecommendation = (heatingBTU: number): string => {
    if (heatingBTU <= 60000) {
      return '40-60k BTU furnace or heat pump';
    } else if (heatingBTU <= 80000) {
      return '60-80k BTU furnace or heat pump';
    } else if (heatingBTU <= 120000) {
      return '80-120k BTU furnace or heat pump';
    } else {
      return '120k+ BTU furnace or large heat pump';
    }
  };

  const getCostEstimates = (coolingTons: number, heatingBTU: number): string => {
    const acCostLow = Math.round(coolingTons * 1500);
    const acCostHigh = Math.round(coolingTons * 2500);
    const heatingCostLow = Math.round(heatingBTU / 1000 * 25);
    const heatingCostHigh = Math.round(heatingBTU / 1000 * 50);
    const laborCostLow = Math.round((acCostLow + heatingCostLow) * 0.5);
    const laborCostHigh = Math.round((acCostHigh + heatingCostHigh) * 0.8);
    const totalLow = acCostLow + heatingCostLow + laborCostLow + 3000 + 200;
    const totalHigh = acCostHigh + heatingCostHigh + laborCostHigh + 7000 + 500;

    return `
      <div class="space-y-2 text-sm text-orange-800">
        <div class="flex justify-between">
          <span>AC Unit:</span>
          <span class="font-medium">$${acCostLow.toLocaleString()} - $${acCostHigh.toLocaleString()}</span>
        </div>
        <div class="flex justify-between">
          <span>Furnace/Heat Pump:</span>
          <span class="font-medium">$${heatingCostLow.toLocaleString()} - $${heatingCostHigh.toLocaleString()}</span>
        </div>
        <div class="flex justify-between">
          <span>Labor + Installation:</span>
          <span class="font-medium">$${laborCostLow.toLocaleString()} - $${laborCostHigh.toLocaleString()}</span>
        </div>
        <div class="flex justify-between pt-2 border-t border-orange-300 font-semibold">
          <span>Total Range:</span>
          <span>$${totalLow.toLocaleString()} - $${totalHigh.toLocaleString()}</span>
        </div>
      </div>
    `;
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Hero Section */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('HVAC Load Calculator')}</h1>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto">
          Calculate the proper heating and cooling load (BTU requirements) for your home. Get accurate HVAC system sizing for optimal comfort and energy efficiency.
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Calculator */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>
        {/* Left Column - Input Form */}

      <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Home Specifications</h2>

          <div className="space-y-4">
            {/* Square Footage */}
            <div>
              <label htmlFor="squareFootage" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                Total Square Footage
              </label>
              <input
                type="number"
                id="squareFootage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 2000"
                min="100"
                max="20000"
                value={squareFootage}
                onChange={(e) => setSquareFootage(Number(e.target.value))}
              />
            </div>

            {/* Ceiling Height */}
            <div>
              <label htmlFor="ceilingHeight" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
                </svg>
                Ceiling Height
              </label>
              <select
                id="ceilingHeight"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={ceilingHeight}
                onChange={(e) => setCeilingHeight(Number(e.target.value))}
              >
                <option value="8">8 feet</option>
                <option value="9">9 feet</option>
                <option value="10">10 feet</option>
                <option value="12">12 feet</option>
                <option value="14">14+ feet</option>
              </select>
            </div>

            {/* Climate Zone */}
            <div>
              <label htmlFor="climateZone" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                Climate Zone
              </label>
              <select
                id="climateZone"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={climateZone}
                onChange={(e) => setClimateZone(Number(e.target.value))}
              >
                <option value="1">Zone 1 - Very Hot (Miami, Hawaii)</option>
                <option value="2">Zone 2 - Hot (Houston, Phoenix)</option>
                <option value="3">Zone 3 - Warm (Atlanta, Las Vegas)</option>
                <option value="4">Zone 4 - Moderate (NYC, Denver)</option>
                <option value="5">Zone 5 - Cool (Chicago, Boston)</option>
                <option value="6">Zone 6 - Cold (Minneapolis, Portland)</option>
                <option value="7">Zone 7 - Very Cold (Duluth, Anchorage)</option>
              </select>
            </div>

            {/* Home Type */}
            <div>
              <label htmlFor="homeType" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
                Home Type
              </label>
              <select
                id="homeType"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={homeType}
                onChange={(e) => setHomeType(e.target.value)}
              >
                <option value="single">Single Family Home</option>
                <option value="townhouse">Townhouse</option>
                <option value="condo">Condo/Apartment</option>
                <option value="mobile">Mobile Home</option>
              </select>
            </div>

            {/* Insulation Level */}
            <div>
              <label htmlFor="insulationLevel" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
                </svg>
                Insulation Level
              </label>
              <select
                id="insulationLevel"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={insulationLevel}
                onChange={(e) => setInsulationLevel(e.target.value)}
              >
                <option value="poor">Poor (Pre-1980, No Updates)</option>
                <option value="average">Average (Some Updates)</option>
                <option value="good">Good (Well Insulated)</option>
                <option value="excellent">Excellent (New/Energy Star)</option>
              </select>
            </div>

            {/* Window Count */}
            <div>
              <label htmlFor="windowCount" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM14 5a1 1 0 011-1h4a1 1 0 011 1v7a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zM14 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1v-3z"></path>
                </svg>
                Number of Windows
              </label>
              <select
                id="windowCount"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={windowCount}
                onChange={(e) => setWindowCount(e.target.value)}
              >
                <option value="few">Few (1-10 windows)</option>
                <option value="average">Average (10-20 windows)</option>
                <option value="many">Many (20+ windows)</option>
              </select>
            </div>

            {/* Window Type */}
            <div>
              <label htmlFor="windowType" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Window Type
              </label>
              <select
                id="windowType"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={windowType}
                onChange={(e) => setWindowType(e.target.value)}
              >
                <option value="single">Single Pane</option>
                <option value="double">Double Pane</option>
                <option value="triple">Triple Pane</option>
                <option value="lowE">Low-E Coated</option>
              </select>
            </div>

            {/* Sun Exposure */}
            <div>
              <label htmlFor="sunExposure" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Sun Exposure
              </label>
              <select
                id="sunExposure"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={sunExposure}
                onChange={(e) => setSunExposure(e.target.value)}
              >
                <option value="low">Low (Heavily Shaded)</option>
                <option value="medium">Medium (Partially Shaded)</option>
                <option value="high">High (Full Sun Exposure)</option>
              </select>
            </div>

            {/* Number of Occupants */}
            <div>
              <label htmlFor="occupants" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Number of Occupants
              </label>
              <input
                type="number"
                id="occupants"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 4"
                min="1"
                max="20"
                value={occupants}
                onChange={(e) => setOccupants(Number(e.target.value))}
              />
            </div>
          </div>

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
          </div>
        </div>

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">HVAC Requirements</h3>
            <div id="results-sidebar">
              {resultsHTML ? (
                <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
              ) : (
                <div className="text-center text-gray-500 py-4 sm:py-6 md:py-8">
                  <svg className="inline-block w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                  </svg>
                  <p className="text-sm">Enter your home details to calculate HVAC requirements</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">
        {/* Card 1: BTU Basics */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-blue-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">BTU Basics</h3>
              <p className="text-sm text-gray-600">BTU (British Thermal Unit) measures cooling/heating capacity. One ton of cooling equals 12,000 BTU/hr. Proper sizing is critical for efficiency and comfort.</p>
            </div>
          </div>
        </div>
{/* Card 2: Climate Zones */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-green-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Climate Zones</h3>
              <p className="text-sm text-gray-600">The US has 7 climate zones. Zone 1 (Miami) needs more cooling, Zone 7 (Alaska) needs more heating. Your zone significantly affects HVAC sizing requirements.</p>
            </div>
          </div>
        </div>

        {/* Card 3: System Sizing */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-purple-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Proper Sizing</h3>
              <p className="text-sm text-gray-600">Oversized units cycle too frequently and waste energy. Undersized units run constantly and can&apos;t maintain comfort. Proper sizing saves 20-30% on energy costs.</p>
            </div>
          </div>
        </div>

        {/* Card 4: Insulation Impact */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-orange-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Insulation Impact</h3>
              <p className="text-sm text-gray-600">Good insulation (R-13 walls, R-38 attic) can reduce HVAC load by 30-40%. Poor insulation may require 40% more capacity and higher operating costs.</p>
            </div>
          </div>
        </div>

        {/* Card 5: Efficiency Ratings */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-teal-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Efficiency Ratings</h3>
              <p className="text-sm text-gray-600">SEER (cooling): Min 14, Good 16+. HSPF (heat pump): Min 8.2, Good 9.0+. AFUE (furnace): Min 80%, Good 90%+. Higher ratings mean lower operating costs.</p>
            </div>
          </div>
        </div>

        {/* Card 6: Installation Costs */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow">
          <div className="flex items-start mb-3">
            <div className="bg-red-100 rounded-lg p-2 mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">Installation Costs</h3>
              <p className="text-sm text-gray-600">Average HVAC replacement: $5,000-$12,000. Includes equipment, labor, permits, and ductwork modifications. Heat pumps cost 10-30% more but save on heating.</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How do I know what size HVAC system I need?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              HVAC size depends on square footage, climate zone, insulation, windows, and ceiling height. Use this calculator as a starting point, then get a professional Manual J load calculation. For most homes, expect 1 ton (12,000 BTU) per 400-600 square feet, adjusted for your specific conditions.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              What happens if my HVAC system is oversized?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              An oversized HVAC system short-cycles (turns on/off frequently), which reduces efficiency, increases wear, and fails to dehumidify properly. This leads to uncomfortable temperature swings, higher energy bills, and premature equipment failure. It&apos;s better to slightly undersize than oversize.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How much does insulation affect HVAC sizing?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Insulation significantly impacts HVAC load. Poor insulation can increase heating/cooling requirements by 30-50%. Upgrading from poor (R-11 walls) to good insulation (R-19 walls, R-38 attic) may allow you to downsize by half a ton or more, saving on both equipment and operating costs.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              Should I get a heat pump or traditional AC and furnace?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Heat pumps work well in zones 1-5 and provide efficient heating and cooling in one unit. In very cold climates (zones 6-7), traditional AC + furnace may be more reliable, or consider a cold-climate heat pump with backup heat. Heat pumps cost 10-30% more upfront but save 30-50% on heating costs.
            </div>
          </details>

          <details className="group">
            <summary className="cursor-pointer font-medium text-gray-800 py-3 border-b border-gray-200 flex justify-between items-center">
              How often should I replace my HVAC system?
              <svg className="w-5 h-5 transform group-open:rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </summary>
            <div className="py-3 text-gray-600 text-sm">
              Air conditioners last 15-20 years, furnaces 15-25 years, and heat pumps 10-15 years. Replace when repair costs exceed 50% of replacement cost, efficiency drops significantly, or the system uses R-22 refrigerant. Modern systems are 30-50% more efficient than 15-year-old units.
            </div>
          </details>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className="block p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow"
            >
              <div className={`inline-block px-3 py-1 ${calc.color || 'bg-gray-500'} text-white text-xs font-semibold rounded-full mb-2`}>
                {calc.icon}
              </div>
              <h3 className="font-semibold text-gray-800 mb-1">{calc.title}</h3>
              <p className="text-sm text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="hvac-load-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <style jsx>{`
        input:focus, select:focus {
          outline: none;
        }

        details summary::-webkit-details-marker {
          display: none;
        }

        details[open] summary {
          border-bottom-color: transparent;
        }
      `}</style>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

    </div>
  );
}
