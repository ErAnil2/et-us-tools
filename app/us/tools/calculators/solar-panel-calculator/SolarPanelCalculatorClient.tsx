'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
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

interface SolarPanelCalculatorClientProps {
  relatedCalculators?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

const fallbackFaqs = [
  {
    id: '1',
    question: 'How accurate is this solar panel calculator?',
    answer: 'This calculator provides estimates based on average values and typical solar installations. Actual results may vary based on specific site conditions, equipment choices, local electricity rates, shading, roof orientation, and installation quality. For precise quotes, consult with 3-4 local solar installers who can perform a detailed site assessment.',
    order: 1
  },
  {
    id: '2',
    question: 'What is the federal solar tax credit?',
    answer: 'The Investment Tax Credit (ITC) allows you to deduct 30% of the cost of installing a solar energy system from your federal taxes through 2032. There\'s no maximum amount that can be claimed, and it applies to both residential and commercial solar installations. The credit decreases to 26% in 2033 and 22% in 2034.',
    order: 2
  },
  {
    id: '3',
    question: 'How long do solar panels last?',
    answer: 'Quality solar panels typically last 25-30+ years. Most manufacturers offer a 25-year performance warranty guaranteeing 80-90% of original output after 25 years. The panels degrade at about 0.5% per year. While the panels last decades, inverters typically need replacement after 10-15 years.',
    order: 3
  },
  {
    id: '4',
    question: 'Do I need battery storage with solar panels?',
    answer: 'Battery storage is optional for grid-tied systems. With net metering, excess energy is sent to the grid for credits. Batteries add $10,000-$15,000 but provide backup power during outages and energy independence. They\'re most valuable in areas with time-of-use rates, unreliable grids, or limited net metering.',
    order: 4
  },
  {
    id: '5',
    question: 'Will solar panels work during cloudy days or winter?',
    answer: 'Yes, solar panels work on cloudy days and in winter, but at reduced efficiency. They can produce 10-25% of their rated capacity on cloudy days. Winter production is lower due to shorter days and lower sun angles, but cold temperatures actually improve panel efficiency.',
    order: 5
  },
  {
    id: '6',
    question: 'How much roof space do I need for solar panels?',
    answer: 'Typically, you need about 17.5 square feet per panel, or roughly 70 square feet per kW of solar capacity. An average home system of 6-10 kW requires 400-700 square feet of roof space. South-facing roofs with minimal shading provide the best results.',
    order: 6
  }
];

export default function SolarPanelCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: SolarPanelCalculatorClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('solar-panel-calculator');

  const [monthlyBill, setMonthlyBill] = useState<number>(150);
  const [electricityRate, setElectricityRate] = useState<number>(0.12);
  const [sunHours, setSunHours] = useState<string>('5.4');
  const [customSunHours, setCustomSunHours] = useState<number>(5.4);
  const [systemEfficiency, setSystemEfficiency] = useState<number>(0.85);
  const [panelWattage, setPanelWattage] = useState<number>(400);
  const [costPerWatt, setCostPerWatt] = useState<number>(2.80);
  const [taxCredit, setTaxCredit] = useState<number>(30);

  const [systemSize, setSystemSize] = useState<number>(10.5);
  const [monthlyUsage, setMonthlyUsage] = useState<number>(1250);
  const [panelsNeeded, setPanelsNeeded] = useState<number>(26);
  const [annualProduction, setAnnualProduction] = useState<number>(15068);
  const [systemCost, setSystemCost] = useState<number>(29400);
  const [netCost, setNetCost] = useState<number>(20580);
  const [paybackPeriod, setPaybackPeriod] = useState<number>(11.4);
  const [annualSavings, setAnnualSavings] = useState<number>(1800);
  const [totalSavings, setTotalSavings] = useState<number>(45000);
  const [netProfit, setNetProfit] = useState<number>(24420);
  const [roi, setRoi] = useState<number>(119);
  const [roofSpace, setRoofSpace] = useState<string>('~735 sq ft (~68 sq m)');

  useEffect(() => {
    calculateSolar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyBill, electricityRate, sunHours, customSunHours, systemEfficiency, panelWattage, costPerWatt, taxCredit]);

  const calculateSolar = () => {
    // Get effective sun hours
    let effectiveSunHours: number;
    if (sunHours === 'custom') {
      effectiveSunHours = customSunHours;
    } else {
      effectiveSunHours = parseFloat(sunHours);
    }

    // Validate inputs
    if (monthlyBill <= 0 || electricityRate <= 0 || effectiveSunHours <= 0) {
      return;
    }

    // Calculate energy usage
    const monthlyUsageCalc = monthlyBill / electricityRate;
    const annualUsage = monthlyUsageCalc * 12;

    // Calculate required system size
    const dailyUsage = annualUsage / 365;
    const requiredSystemSize = (dailyUsage / (effectiveSunHours * systemEfficiency)) / 1000; // kW

    // Calculate number of panels (always round up)
    const panelsNeededCalc = Math.ceil((requiredSystemSize * 1000) / panelWattage);
    const actualSystemSize = (panelsNeededCalc * panelWattage) / 1000; // Actual kW

    // Calculate production
    const dailyProduction = actualSystemSize * effectiveSunHours * systemEfficiency;
    const annualProductionCalc = dailyProduction * 365;

    // Calculate costs
    const systemCostCalc = actualSystemSize * 1000 * costPerWatt;
    const taxCreditDecimal = taxCredit / 100;
    const netCostCalc = systemCostCalc * (1 - taxCreditDecimal);
    const annualSavingsCalc = Math.min(annualProductionCalc * electricityRate, monthlyBill * 12);
    const paybackPeriodCalc = netCostCalc / annualSavingsCalc;

    // Calculate roof space (approximately 17.5 sq ft per panel)
    const roofSpaceSqFt = Math.ceil(panelsNeededCalc * 17.5);
    const roofSpaceSqM = Math.ceil(roofSpaceSqFt * 0.092903);

    // 25-year savings calculation with degradation and rate increases
    const systemLifespan = 25;
    const annualDegradation = 0.005; // 0.5% per year
    const rateIncrease = 0.03; // 3% per year
    let totalSavingsCalc = 0;

    for (let year = 1; year <= systemLifespan; year++) {
      const yearlyProduction = annualProductionCalc * Math.pow(1 - annualDegradation, year - 1);
      const yearlyRate = electricityRate * Math.pow(1 + rateIncrease, year - 1);
      const yearlySavings = Math.min(
        yearlyProduction * yearlyRate,
        monthlyBill * 12 * Math.pow(1 + rateIncrease, year - 1)
      );
      totalSavingsCalc += yearlySavings;
    }

    const netProfitCalc = totalSavingsCalc - netCostCalc;
    const roiCalc = (netProfitCalc / netCostCalc) * 100;

    // Update state
    setSystemSize(actualSystemSize);
    setMonthlyUsage(monthlyUsageCalc);
    setPanelsNeeded(panelsNeededCalc);
    setAnnualProduction(annualProductionCalc);
    setSystemCost(systemCostCalc);
    setNetCost(netCostCalc);
    setPaybackPeriod(paybackPeriodCalc);
    setAnnualSavings(annualSavingsCalc);
    setTotalSavings(totalSavingsCalc);
    setNetProfit(netProfitCalc);
    setRoi(roiCalc);
    setRoofSpace(`~${roofSpaceSqFt} sq ft (~${roofSpaceSqM} sq m)`);
  };

  // Schema.org structured data
  const webAppSchema = generateWebAppSchema(
    'Solar Panel Calculator',
    'Calculate solar system size, energy production, cost savings, and payback period for residential solar installations',
    'https://example.com/us/tools/calculators/solar-panel-calculator',
    'Utility'
  );

  return (
    <article className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Schema.org JSON-LD */}
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

      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 rounded-2xl p-3 sm:p-5 md:p-8 text-white">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">
          {getH1('Solar Panel Calculator')}
        </h1>
        <p className="text-xl text-green-100">
          {getSubHeading('Calculate solar system size, energy production, cost, and long-term savings')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-3 gap-0">

          {/* Left Column - Inputs */}
          <div className="lg:col-span-2 p-3 sm:p-5 md:p-8 space-y-3 sm:space-y-4 md:space-y-6 lg:border-r border-gray-200">

            {/* Monthly Electric Bill */}
            <div>
              <label htmlFor="monthlyBill" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
                </svg>
                Average Monthly Electric Bill ($)
              </label>
              <input
                type="number"
                id="monthlyBill"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="150"
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(parseFloat(e.target.value) || 0)}
                min="0"
                step="1"
              />
            </div>

            {/* Electricity Rate */}
            <div>
              <label htmlFor="electricityRate" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                </svg>
                Electricity Rate ($/kWh)
              </label>
              <input
                type="number"
                id="electricityRate"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                placeholder="0.12"
                value={electricityRate}
                onChange={(e) => setElectricityRate(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>

            {/* Location/Sun Hours */}
            <div>
              <label htmlFor="sunHours" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
                </svg>
                Location (Peak Sun Hours per Day)
              </label>
              <select
                id="sunHours"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={sunHours}
                onChange={(e) => setSunHours(e.target.value)}
              >
                <option value="3.5">Seattle, WA (3.5 hours)</option>
                <option value="4.2">New York, NY (4.2 hours)</option>
                <option value="4.6">Chicago, IL (4.6 hours)</option>
                <option value="5.0">Denver, CO (5.0 hours)</option>
                <option value="5.4">Los Angeles, CA (5.4 hours)</option>
                <option value="5.7">Miami, FL (5.7 hours)</option>
                <option value="6.1">Phoenix, AZ (6.1 hours)</option>
                <option value="custom">Custom (Enter Your Own)</option>
              </select>
            </div>

            {/* Custom Sun Hours (conditionally rendered) */}
            {sunHours === 'custom' && (
              <div>
                <label htmlFor="customSunHours" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                  Custom Peak Sun Hours
                </label>
                <input
                  type="number"
                  id="customSunHours"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="5.4"
                  value={customSunHours}
                  onChange={(e) => setCustomSunHours(parseFloat(e.target.value) || 5.4)}
                  min="2"
                  max="8"
                  step="0.1"
                />
                <p className="text-xs text-gray-500 mt-1">Typical range: 3-7 hours depending on location</p>
              </div>
            )}

            {/* System Efficiency */}
            <div>
              <label htmlFor="systemEfficiency" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                System Efficiency
              </label>
              <select
                id="systemEfficiency"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={systemEfficiency}
                onChange={(e) => setSystemEfficiency(parseFloat(e.target.value))}
              >
                <option value="0.75">75% - Older systems with shading</option>
                <option value="0.80">80% - Average system</option>
                <option value="0.85">85% - Good modern system</option>
                <option value="0.90">90% - Premium high-efficiency system</option>
              </select>
            </div>

            {/* Panel Wattage */}
            <div>
              <label htmlFor="panelWattage" className="block text-sm font-medium text-gray-700 mb-1">
                <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
                </svg>
                Panel Wattage
              </label>
              <select
                id="panelWattage"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={panelWattage}
                onChange={(e) => setPanelWattage(parseInt(e.target.value))}
              >
                <option value="300">300W - Standard panels</option>
                <option value="350">350W - Mid-range panels</option>
                <option value="400">400W - High-efficiency panels</option>
                <option value="450">450W - Premium panels</option>
              </select>
            </div>

            {/* Cost Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="costPerWatt" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Cost per Watt ($)
                </label>
                <input
                  type="number"
                  id="costPerWatt"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="2.80"
                  value={costPerWatt}
                  onChange={(e) => setCostPerWatt(parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.10"
                />
              </div>
              <div>
                <label htmlFor="taxCredit" className="block text-sm font-medium text-gray-700 mb-1">
                  <svg className="inline-block w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2z"></path>
                  </svg>
                  Federal Tax Credit (%)
                </label>
                <input
                  type="number"
                  id="taxCredit"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="30"
                  value={taxCredit}
                  onChange={(e) => setTaxCredit(parseFloat(e.target.value) || 0)}
                  min="0"
                  max="100"
                  step="1"
                />
              </div>
            </div>

          </div>

          {/* Right Column - Results (NOT sticky per user request) */}
          <div className="p-3 sm:p-4 md:p-6 bg-gradient-to-br from-gray-50 to-green-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Solar System Results</h3>

            {/* System Size */}
            <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-center mb-4 text-white shadow-md">
              <div className="text-xl sm:text-2xl md:text-3xl font-bold">{systemSize.toFixed(1)}</div>
              <div className="text-green-100 text-sm">kW System Size</div>
            </div>

            {/* Key Metrics */}
            <div className="space-y-3 mb-4">
              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Monthly Usage</div>
                <div className="text-lg font-semibold text-gray-800">{monthlyUsage.toFixed(0)} kWh</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Panels Needed</div>
                <div className="text-lg font-semibold text-green-600">{panelsNeeded} panels</div>
              </div>
<div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">Annual Production</div>
                <div className="text-lg font-semibold text-gray-800">{annualProduction.toFixed(0)} kWh/year</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">System Cost</div>
                <div className="text-lg font-semibold text-red-600">${systemCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
              </div>

              <div className="bg-white rounded-lg p-3 shadow-sm">
                <div className="text-xs text-gray-500 mb-1">After Tax Credit</div>
                <div className="text-lg font-semibold text-green-600">${netCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
              </div>

              <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 shadow-md text-white">
                <div className="text-xs text-purple-100 mb-1">Payback Period</div>
                <div className="text-lg font-semibold">{paybackPeriod.toFixed(1)} years</div>
              </div>
            </div>

            {/* 25-Year Savings */}
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 shadow-md text-white">
              <div className="font-semibold mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
                25-Year Savings
              </div>
              <div className="text-teal-50 space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span>Annual savings:</span>
                  <span className="font-semibold">${annualSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Total avoided costs:</span>
                  <span className="font-semibold">${totalSavings.toFixed(0)}</span>
                </div>
                <div className="flex justify-between border-t border-teal-400 pt-1.5 mt-1.5">
                  <span>Net profit:</span>
                  <span className="font-semibold text-base">${netProfit.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>ROI:</span>
                  <span className="font-semibold">{roi.toFixed(0)}%</span>
                </div>
              </div>
            </div>

            {/* Roof Space Needed */}
            <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800 text-sm">
              <div className="font-semibold mb-1">Roof Space Required</div>
              <div className="text-xs">{roofSpace}</div>
            </div>

          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Mobile Results (visible only on mobile) */}
      <div className="lg:hidden bg-gradient-to-br from-gray-50 to-green-50 rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Solar System Results</h3>

        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg p-4 text-center mb-4 text-white shadow-md">
          <div className="text-xl sm:text-2xl md:text-3xl font-bold">{systemSize.toFixed(1)}</div>
          <div className="text-green-100 text-sm">kW System Size</div>
        </div>

        <div className="space-y-3 mb-4">
          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Monthly Usage</div>
            <div className="text-lg font-semibold text-gray-800">{monthlyUsage.toFixed(0)} kWh</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Panels Needed</div>
            <div className="text-lg font-semibold text-green-600">{panelsNeeded} panels</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">Annual Production</div>
            <div className="text-lg font-semibold text-gray-800">{annualProduction.toFixed(0)} kWh/year</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">System Cost</div>
            <div className="text-lg font-semibold text-red-600">${systemCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
          </div>

          <div className="bg-white rounded-lg p-3 shadow-sm">
            <div className="text-xs text-gray-500 mb-1">After Tax Credit</div>
            <div className="text-lg font-semibold text-green-600">${netCost.toLocaleString('en-US', {maximumFractionDigits: 0})}</div>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg p-3 shadow-md text-white">
            <div className="text-xs text-purple-100 mb-1">Payback Period</div>
            <div className="text-lg font-semibold">{paybackPeriod.toFixed(1)} years</div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-4 shadow-md text-white">
          <div className="font-semibold mb-2 flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            25-Year Savings
          </div>
          <div className="text-teal-50 space-y-1.5 text-sm">
            <div className="flex justify-between">
              <span>Annual savings:</span>
              <span className="font-semibold">${annualSavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Total avoided costs:</span>
              <span className="font-semibold">${totalSavings.toFixed(0)}</span>
            </div>
            <div className="flex justify-between border-t border-teal-400 pt-1.5 mt-1.5">
              <span>Net profit:</span>
              <span className="font-semibold text-base">${netProfit.toFixed(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>ROI:</span>
              <span className="font-semibold">{roi.toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800 text-sm">
          <div className="font-semibold mb-1">Roof Space Required</div>
          <div className="text-xs">{roofSpace}</div>
        </div>
      </div>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8">

        {/* System Sizing Guide */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-3 sm:p-4 md:p-6 border border-blue-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-blue-800">System Sizing Guide</h3>
          </div>
          <ul className="space-y-2 text-sm text-blue-700">
            <li><strong>Small home:</strong> 3-5 kW (8-13 panels)</li>
            <li><strong>Average home:</strong> 6-10 kW (15-25 panels)</li>
            <li><strong>Large home:</strong> 10-15 kW (25-38 panels)</li>
            <li><strong>Rule of thumb:</strong> 1 kW per 1,000 kWh/year</li>
            <li><strong>Roof space:</strong> ~70 sq ft per kW installed</li>
          </ul>
        </div>

        {/* Peak Sun Hours */}
        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-lg p-3 sm:p-4 md:p-6 border border-yellow-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-yellow-800">Peak Sun Hours by Region</h3>
          </div>
          <div className="space-y-2 text-sm text-yellow-700">
            <div className="flex justify-between"><span>Southwest (AZ, NM):</span> <strong>5.5-6.5 hrs</strong></div>
            <div className="flex justify-between"><span>Southeast (FL, GA):</span> <strong>4.5-5.5 hrs</strong></div>
            <div className="flex justify-between"><span>California:</span> <strong>5.0-6.0 hrs</strong></div>
            <div className="flex justify-between"><span>Midwest (IL, OH):</span> <strong>4.0-5.0 hrs</strong></div>
            <div className="flex justify-between"><span>Northeast (NY, MA):</span> <strong>3.5-4.5 hrs</strong></div>
            <div className="flex justify-between"><span>Northwest (WA, OR):</span> <strong>3.5-4.0 hrs</strong></div>
          </div>
        </div>

        {/* Financial Benefits */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-3 sm:p-4 md:p-6 border border-green-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-green-800">Financial Benefits</h3>
          </div>
          <ul className="space-y-2 text-sm text-green-700">
            <li>Reduce electric bills by 70-100%</li>
            <li>30% federal tax credit through 2032</li>
            <li>State and local incentives available</li>
            <li>Increase home value by ~4%</li>
            <li>Typical payback: 8-15 years</li>
            <li>25+ year system lifespan</li>
          </ul>
        </div>

        {/* Environmental Impact */}
        <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-lg p-3 sm:p-4 md:p-6 border border-teal-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-teal-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-teal-800">Environmental Impact</h3>
          </div>
          <ul className="space-y-2 text-sm text-teal-700">
            <li>Reduce CO2 emissions by 3-4 tons/year</li>
            <li>Equivalent to planting 100+ trees annually</li>
            <li>Clean, renewable energy source</li>
            <li>Reduce dependence on fossil fuels</li>
            <li>25+ year system lifespan</li>
            <li>Panels are 95% recyclable</li>
          </ul>
        </div>

        {/* System Components */}
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-3 sm:p-4 md:p-6 border border-purple-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-purple-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-lg font-semibold text-purple-800">System Components</h3>
          </div>
          <ul className="space-y-2 text-sm text-purple-700">
            <li><strong>Solar Panels:</strong> Convert sunlight to DC power</li>
            <li><strong>Inverter:</strong> Converts DC to AC for home use</li>
            <li><strong>Racking:</strong> Mounting system for roof/ground</li>
            <li><strong>Monitoring:</strong> Track production in real-time</li>
            <li><strong>Battery (optional):</strong> Store excess energy</li>
            <li><strong>Warranty:</strong> 25-year performance guarantee</li>
          </ul>
        </div>

        {/* Important Considerations */}
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-3 sm:p-4 md:p-6 border border-orange-200">
          <div className="flex items-center mb-3">
            <svg className="w-6 h-6 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
            </svg>
            <h3 className="text-lg font-semibold text-orange-800">Important Factors</h3>
          </div>
          <ul className="space-y-2 text-sm text-orange-700">
            <li>Roof condition and age (20+ years left)</li>
            <li>Shading from trees or nearby buildings</li>
            <li>Roof orientation (south-facing is best)</li>
            <li>Local utility net metering policies</li>
            <li>HOA approval and permit requirements</li>
            <li>Property insurance considerations</li>
          </ul>
        </div>

      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <CalculatorMobileMrec2 />



      

      {/* FAQ Section */}
      <FirebaseFAQs pageId="solar-panel-calculator" fallbackFaqs={fallbackFaqs} className="mb-4 sm:mb-6 md:mb-8" />

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <RelatedCalculatorCards calculators={relatedCalculators} />

    </article>
  );
}
