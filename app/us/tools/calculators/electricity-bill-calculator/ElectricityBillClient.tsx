'use client';

import { useState, useEffect } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
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
interface ElectricityBillClientProps {
  relatedCalculators: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

interface Appliance {
  name: string;
  kwh: number;
}

// Fallback FAQs for SEO
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'How is my electricity bill calculated?',
    answer: 'Your electricity bill is calculated by multiplying your kWh usage by the rate per kWh, then adding fixed charges (meter fees, delivery charges) and applicable taxes. The formula is: (kWh × Rate) + Fixed Charges + Taxes = Total Bill.',
    order: 1
  },
  {
    id: 'faq-2',
    question: 'What is the average electricity bill in the US?',
    answer: 'The average US household uses about 877 kWh per month, resulting in an average bill of $120-140. However, this varies significantly by state - Hawaii has the highest rates (~32¢/kWh) while Louisiana has some of the lowest (~9¢/kWh).',
    order: 2
  },
  {
    id: 'faq-3',
    question: 'What uses the most electricity in a home?',
    answer: 'Air conditioning and heating typically use 40-50% of home electricity. Other major consumers include water heaters (14-18%), appliances like refrigerators and washers (13%), lighting (9-12%), and electronics (4-7%).',
    order: 3
  },
  {
    id: 'faq-4',
    question: 'What is time-of-use pricing?',
    answer: 'Time-of-use (TOU) pricing charges different rates depending on when you use electricity. Peak hours (typically 2-7 PM) have higher rates, while off-peak hours (nights and weekends) have lower rates. This encourages shifting usage to off-peak times.',
    order: 4
  },
  {
    id: 'faq-5',
    question: 'How can I reduce my electricity bill?',
    answer: 'Key strategies include: using LED bulbs, setting thermostats efficiently (68°F winter, 78°F summer), unplugging devices when not in use, using energy-efficient appliances, washing clothes in cold water, and air-drying dishes.',
    order: 5
  },
  {
    id: 'faq-6',
    question: 'What is a kWh and how is it measured?',
    answer: 'A kilowatt-hour (kWh) measures energy consumption. It equals 1,000 watts used for one hour. For example, a 100-watt bulb running for 10 hours uses 1 kWh. Your electric meter tracks cumulative kWh usage for billing.',
    order: 6
  }
];

const appliances: Appliance[] = [
  { name: 'Air Conditioner (12 hrs/day)', kwh: 360 },
  { name: 'Electric Water Heater', kwh: 450 },
  { name: 'Refrigerator', kwh: 100 },
  { name: 'Electric Dryer (15 loads)', kwh: 75 },
  { name: 'Dishwasher (20 cycles)', kwh: 30 },
  { name: 'TV + Electronics (6 hrs/day)', kwh: 50 },
  { name: 'Computer (8 hrs/day)', kwh: 25 },
  { name: 'Lighting (LED, whole house)', kwh: 30 },
];

export default function ElectricityBillClient({ relatedCalculators = defaultRelatedCalculators }: ElectricityBillClientProps) {
  // Firebase SEO data
  const { getH1, getSubHeading, faqSchema } = usePageSEO('electricity-bill-calculator');

  const [monthlyKwh, setMonthlyKwh] = useState<number>(900);
  const [electricityRate, setElectricityRate] = useState<number>(13.5);
  const [fixedCharges, setFixedCharges] = useState<number>(15);
  const [taxRate, setTaxRate] = useState<number>(8.25);
  const [timeOfUse, setTimeOfUse] = useState<boolean>(false);
  const [peakRate, setPeakRate] = useState<number>(18);
  const [offPeakRate, setOffPeakRate] = useState<number>(9);
  const [peakUsagePercent, setPeakUsagePercent] = useState<number>(40);
  const [showAppliances, setShowAppliances] = useState<boolean>(false);
  const [selectedAppliances, setSelectedAppliances] = useState<Set<number>>(new Set());

  const [energyCharges, setEnergyCharges] = useState<number>(0);
  const [subtotal, setSubtotal] = useState<number>(0);
  const [taxes, setTaxes] = useState<number>(0);
  const [totalBill, setTotalBill] = useState<number>(0);
  const [annualCost, setAnnualCost] = useState<number>(0);
  const [dailyCost, setDailyCost] = useState<number>(0);

  useEffect(() => {
    calculateBill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [monthlyKwh, electricityRate, fixedCharges, taxRate, timeOfUse, peakRate, offPeakRate, peakUsagePercent]);

  const calculateBill = () => {
    if (monthlyKwh <= 0 || electricityRate <= 0) {
      setEnergyCharges(0);
      setSubtotal(0);
      setTaxes(0);
      setTotalBill(0);
      setAnnualCost(0);
      setDailyCost(0);
      return;
    }

    let charges = 0;

    // Calculate energy charges
    if (timeOfUse) {
      const peakKwh = monthlyKwh * (peakUsagePercent / 100);
      const offPeakKwh = monthlyKwh * ((100 - peakUsagePercent) / 100);
      charges = (peakKwh * peakRate / 100) + (offPeakKwh * offPeakRate / 100);
    } else {
      charges = monthlyKwh * (electricityRate / 100);
    }

    const sub = charges + fixedCharges;
    const tax = sub * (taxRate / 100);
    const total = sub + tax;

    setEnergyCharges(charges);
    setSubtotal(sub);
    setTaxes(tax);
    setTotalBill(total);
    setAnnualCost(total * 12);
    setDailyCost(total / 30);
  };

  const handleApplianceToggle = (index: number) => {
    const newSelected = new Set(selectedAppliances);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedAppliances(newSelected);
  };

  const applyAppliances = () => {
    let total = 0;
    selectedAppliances.forEach(index => {
      total += appliances[index].kwh;
    });
    setMonthlyKwh(total);
    setShowAppliances(false);
  };

  const getComparison = () => {
    const avgKwh = 877;
    if (monthlyKwh < avgKwh * 0.8) {
      return {
        message: `Your usage is ${((1 - monthlyKwh / avgKwh) * 100).toFixed(0)}% below the US average (877 kWh/month). Great job!`,
        color: 'text-green-800'
      };
    } else if (monthlyKwh > avgKwh * 1.2) {
      return {
        message: `Your usage is ${((monthlyKwh / avgKwh - 1) * 100).toFixed(0)}% above the US average (877 kWh/month). Consider energy-saving measures.`,
        color: 'text-orange-800'
      };
    } else {
      return {
        message: 'Your usage is close to the US average of 877 kWh/month (~$120/month).',
        color: 'text-yellow-800'
      };
    }
  };

  const energyPercent = totalBill > 0 ? (energyCharges / totalBill) * 100 : 0;
  const fixedPercent = totalBill > 0 ? (fixedCharges / totalBill) * 100 : 0;
  const taxPercent = totalBill > 0 ? (taxes / totalBill) * 100 : 0;
  const comparison = getComparison();

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-amber-100 py-4 sm:py-6 md:py-8 px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
      {/* Schema.org structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Electricity Bill Calculator",
            "description": "Calculate your electricity costs based on appliance usage, power consumption, and utility rates. Estimate monthly and annual energy expenses.",
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
      {/* FAQ Schema */}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      <article className="max-w-[1180px] mx-auto">
        {/* Header */}
        <header className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1('Electricity Bill Calculator')}
          </h1>
          <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto">
            {getSubHeading('Calculate your electricity costs based on appliance usage, power consumption, and utility rates')}
          </p>
        </header>

      {/* Main Calculator */}
      <div className="lg:grid lg:gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6 md:mb-8" style={{ gridTemplateColumns: '1fr 350px' }}>
        {/* Left Column - Input Form */}
        <div className="bg-white rounded-xl shadow-sm p-4 md:p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Electricity Usage Details</h2>

          <div className="space-y-4">
            {/* Monthly kWh Usage */}
            <div>
              <label htmlFor="monthlyKwh" className="block text-sm font-medium text-gray-700 mb-1">
                ⚡ Monthly kWh Usage
              </label>
              <input
                type="number"
                id="monthlyKwh"
                value={monthlyKwh}
                onChange={(e) => setMonthlyKwh(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 900"
                min="0"
                step="1"
              />
              <p className="text-xs text-gray-500 mt-1">Check your previous electricity bill for average usage</p>
            </div>

            {/* Electricity Rate */}
            <div>
              <label htmlFor="electricityRate" className="block text-sm font-medium text-gray-700 mb-1">
                💵 Electricity Rate (¢/kWh)
              </label>
              <input
                type="number"
                id="electricityRate"
                value={electricityRate}
                onChange={(e) => setElectricityRate(Math.max(0.1, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 13.5"
                min="0.1"
                max="100"
                step="0.1"
              />
              <p className="text-xs text-gray-500 mt-1">US average is ~13.5¢/kWh (varies by state)</p>
            </div>

            {/* Fixed Monthly Charges */}
            <div>
              <label htmlFor="fixedCharges" className="block text-sm font-medium text-gray-700 mb-1">
                📋 Fixed Monthly Charges ($)
              </label>
              <input
                type="number"
                id="fixedCharges"
                value={fixedCharges}
                onChange={(e) => setFixedCharges(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 15.00"
                min="0"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">Service fees, delivery charges, meter fees</p>
            </div>

            {/* Tax Rate */}
            <div>
              <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-1">
                📑 Tax Rate (%)
              </label>
              <input
                type="number"
                id="taxRate"
                value={taxRate}
                onChange={(e) => setTaxRate(Math.max(0, Math.min(30, parseFloat(e.target.value) || 0)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="e.g., 8.25"
                min="0"
                max="30"
                step="0.01"
              />
              <p className="text-xs text-gray-500 mt-1">State and local taxes on electricity</p>
            </div>

            {/* Time-of-Use Toggle */}
            <div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={timeOfUse}
                  onChange={(e) => setTimeOfUse(e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">
                  🕒 Time-of-Use Pricing
                </span>
              </label>
            </div>

            {/* Time-of-Use Details */}
            {timeOfUse && (
              <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="peakRate" className="block text-sm font-medium text-gray-700 mb-1">Peak Rate (¢/kWh)</label>
                    <input
                      type="number"
                      id="peakRate"
                      value={peakRate}
                      onChange={(e) => setPeakRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="18.0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label htmlFor="offPeakRate" className="block text-sm font-medium text-gray-700 mb-1">Off-Peak Rate (¢/kWh)</label>
                    <input
                      type="number"
                      id="offPeakRate"
                      value={offPeakRate}
                      onChange={(e) => setOffPeakRate(Math.max(0, parseFloat(e.target.value) || 0))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="9.0"
                      min="0"
                      step="0.1"
                    />
                  </div>
                </div>
                <div>
                  <label htmlFor="peakUsagePercent" className="block text-sm font-medium text-gray-700 mb-1">Peak Usage (%)</label>
                  <input
                    type="number"
                    id="peakUsagePercent"
                    value={peakUsagePercent}
                    onChange={(e) => setPeakUsagePercent(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="40"
                    min="0"
                    max="100"
                    step="1"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage of usage during peak hours</p>
                </div>
              </div>
            )}

            {/* Common Appliances Section */}
            <div className="border-t pt-4 mt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-md font-semibold text-gray-800">Common Appliances (Optional)</h3>
                <button
                  type="button"
                  onClick={() => setShowAppliances(!showAppliances)}
                  className="text-sm text-blue-600 hover:text-blue-700"
                >
                  {showAppliances ? '▲' : '▼'}
                </button>
              </div>
              {showAppliances && (
                <div className="space-y-3">
                  <p className="text-sm text-gray-600 mb-3">Select appliances to estimate your monthly usage:</p>
                  <div className="grid grid-cols-1 gap-2">
                    {appliances.map((appliance, index) => (
                      <label
                        key={index}
                        className="flex items-center p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAppliances.has(index)}
                          onChange={() => handleApplianceToggle(index)}
                          className="mr-3"
                        />
                        <span className="text-sm">
                          <span className="font-medium">{appliance.name.split('(')[0]}</span>
                          <span className="text-gray-500"> - ~{appliance.kwh} kWh/month</span>
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={applyAppliances}
                    className="w-full mt-3 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm font-medium"
                  >
                    Apply Selected Appliances
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Results */}
          <div className="lg:hidden mt-6">
            {totalBill > 0 && (
              <div className="space-y-4">
                <ResultsDisplay
                  totalBill={totalBill}
                  energyCharges={energyCharges}
                  energyPercent={energyPercent}
                  monthlyKwh={monthlyKwh}
                  electricityRate={electricityRate}
                  fixedCharges={fixedCharges}
                  fixedPercent={fixedPercent}
                  taxes={taxes}
                  taxRate={taxRate}
                  taxPercent={taxPercent}
                  annualCost={annualCost}
                  dailyCost={dailyCost}
                  timeOfUse={timeOfUse}
                  peakRate={peakRate}
                  offPeakRate={offPeakRate}
                  peakUsagePercent={peakUsagePercent}
                  comparison={comparison}
                />
              </div>
            )}
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Right Column - Results (Desktop Only) */}
        <div className="hidden lg:block" style={{ width: '350px' }}>
          <div className="bg-white rounded-xl shadow-sm p-4 md:p-6 lg:sticky lg:top-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Bill Breakdown</h3>
            {totalBill > 0 ? (
              <ResultsDisplay
                totalBill={totalBill}
                energyCharges={energyCharges}
                energyPercent={energyPercent}
                monthlyKwh={monthlyKwh}
                electricityRate={electricityRate}
                fixedCharges={fixedCharges}
                fixedPercent={fixedPercent}
                taxes={taxes}
                taxRate={taxRate}
                taxPercent={taxPercent}
                annualCost={annualCost}
                dailyCost={dailyCost}
                timeOfUse={timeOfUse}
                peakRate={peakRate}
                offPeakRate={offPeakRate}
                peakUsagePercent={peakUsagePercent}
                comparison={comparison}
              />
            ) : (
              <p className="text-sm text-gray-500">Enter values to see results</p>
            )}
          </div>
        </div>
      </div>

        {/* Related Calculators */}
        <RelatedCalculatorCards calculators={relatedCalculators} />

        {/* SEO Content from Firebase */}
        

        {/* FAQ Section */}
        <FirebaseFAQs pageId="electricity-bill-calculator" fallbackFaqs={fallbackFaqs} />
      </article>
    </div>
);
}

// Results Display Component
interface ResultsDisplayProps {
  totalBill: number;
  energyCharges: number;
  energyPercent: number;
  monthlyKwh: number;
  electricityRate: number;
  fixedCharges: number;
  fixedPercent: number;
  taxes: number;
  taxRate: number;
  taxPercent: number;
  annualCost: number;
  dailyCost: number;
  timeOfUse: boolean;
  peakRate: number;
  offPeakRate: number;
  peakUsagePercent: number;
  comparison: { message: string; color: string };
}

function ResultsDisplay({
  totalBill,
  energyCharges,
  energyPercent,
  monthlyKwh,
  electricityRate,
  fixedCharges,
  fixedPercent,
  taxes,
  taxRate,
  taxPercent,
  annualCost,
  dailyCost,
  timeOfUse,
  peakRate,
  offPeakRate,
  peakUsagePercent,
  comparison
}: ResultsDisplayProps) {
  const peakKwh = monthlyKwh * (peakUsagePercent / 100);
  const offPeakKwh = monthlyKwh * ((100 - peakUsagePercent) / 100);
  const peakCost = peakKwh * (peakRate / 100);
  const offPeakCost = offPeakKwh * (offPeakRate / 100);

  return (
    <div className="space-y-4">
      {/* Total Bill */}
      <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <div className="text-sm text-blue-600 mb-1">Monthly Bill</div>
        <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-700">${totalBill.toFixed(2)}</div>
      </div>

      {/* Energy Charges */}
      <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-green-900">Energy Charges</span>
          <span className="text-lg font-bold text-green-700">${energyCharges.toFixed(2)}</span>
        </div>
        <div className="text-xs text-green-600">
          {monthlyKwh.toLocaleString()} kWh × ${(electricityRate / 100).toFixed(3)}/kWh
        </div>
        <div className="mt-2 bg-green-200 rounded-full h-2">
          <div className="bg-green-600 h-2 rounded-full" style={{ width: `${energyPercent}%` }}></div>
        </div>
      </div>

      {/* Fixed Charges */}
      <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg border border-purple-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-purple-900">Fixed Charges</span>
          <span className="text-lg font-bold text-purple-700">${fixedCharges.toFixed(2)}</span>
        </div>
        <div className="text-xs text-purple-600">Service fees, delivery charges</div>
        <div className="mt-2 bg-purple-200 rounded-full h-2">
          <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${fixedPercent}%` }}></div>
        </div>
      </div>

      {/* Taxes */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-lg border border-orange-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-orange-900">Taxes & Fees</span>
          <span className="text-lg font-bold text-orange-700">${taxes.toFixed(2)}</span>
        </div>
        <div className="text-xs text-orange-600">{taxRate}% tax rate</div>
        <div className="mt-2 bg-orange-200 rounded-full h-2">
          <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${taxPercent}%` }}></div>
        </div>
      </div>

      {/* Annual Projection */}
      <div className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
        <div className="flex items-center mb-3">
          <span className="text-sm font-semibold text-gray-800">📅 Annual Projection</span>
        </div>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Usage:</span>
            <span className="font-semibold text-gray-800">{(monthlyKwh * 12).toLocaleString()} kWh</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Annual Cost:</span>
            <span className="font-semibold text-gray-800">${annualCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Daily Cost:</span>
            <span className="font-semibold text-gray-800">${dailyCost.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Time-of-Use Breakdown */}
      {timeOfUse && (
        <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg border border-indigo-200">
          <div className="flex items-center mb-3">
            <span className="text-sm font-semibold text-indigo-900">🕒 Time-of-Use Breakdown</span>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-indigo-700">Peak ({peakKwh.toFixed(0)} kWh):</span>
              <span className="font-semibold text-indigo-900">${peakCost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-indigo-700">Off-Peak ({offPeakKwh.toFixed(0)} kWh):</span>
              <span className="font-semibold text-indigo-900">${offPeakCost.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Comparison */}
      <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
        <div className="flex items-start">
          <div className={`text-sm ${comparison.color}`}>
            <strong>Comparison:</strong> {comparison.message}
          </div>
        </div>
      </div>
    </div>
  );
}
