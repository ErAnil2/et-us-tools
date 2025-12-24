'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface WireSpec {
  diameter: number;
  ampacity_75: number;
  resistance: number;
}

type WireData = Record<string | number, WireSpec>;
type MaterialData = Record<string, WireData>;

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Wire Size Calculator?",
    answer: "A Wire Size Calculator is a free online tool designed to help you quickly and accurately calculate wire size-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Wire Size Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Wire Size Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Wire Size Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function WireSizeCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('wire-size-calculator');

  const [loadCurrent, setLoadCurrent] = useState('20');
  const [systemVoltage, setSystemVoltage] = useState('120');
  const [wireLength, setWireLength] = useState('100');
  const [voltageDrop, setVoltageDrop] = useState('3');
  const [wireMaterial, setWireMaterial] = useState('copper');
  const [installMethod, setInstallMethod] = useState('conduit');
  const [temperature, setTemperature] = useState('86');

  const [recommendedWire, setRecommendedWire] = useState('12 AWG');
  const [minimumAWG, setMinimumAWG] = useState('14 AWG');
  const [ampacityRating, setAmpacityRating] = useState('25 Amps');
  const [actualVoltageDrop, setActualVoltageDrop] = useState('2.8%');
  const [voltageAtLoad, setVoltageAtLoad] = useState('116.6V');
  const [wireDiameter, setWireDiameter] = useState('0.081 inches');
  const [voltageDropColor, setVoltageDropColor] = useState('text-blue-600');

  // AWG wire data (copper, 75°C rating)
  const wireData: MaterialData = {
    copper: {
      18: { diameter: 0.040, ampacity_75: 14, resistance: 6.385 },
      16: { diameter: 0.051, ampacity_75: 18, resistance: 4.016 },
      14: { diameter: 0.064, ampacity_75: 20, resistance: 2.525 },
      12: { diameter: 0.081, ampacity_75: 25, resistance: 1.588 },
      10: { diameter: 0.102, ampacity_75: 35, resistance: 0.999 },
      8: { diameter: 0.128, ampacity_75: 50, resistance: 0.628 },
      6: { diameter: 0.162, ampacity_75: 65, resistance: 0.395 },
      4: { diameter: 0.204, ampacity_75: 85, resistance: 0.249 },
      3: { diameter: 0.229, ampacity_75: 100, resistance: 0.197 },
      2: { diameter: 0.258, ampacity_75: 115, resistance: 0.156 },
      1: { diameter: 0.289, ampacity_75: 130, resistance: 0.124 },
      '1/0': { diameter: 0.325, ampacity_75: 150, resistance: 0.098 },
      '2/0': { diameter: 0.365, ampacity_75: 175, resistance: 0.078 },
      '3/0': { diameter: 0.410, ampacity_75: 200, resistance: 0.062 },
      '4/0': { diameter: 0.460, ampacity_75: 230, resistance: 0.049 }
    },
    aluminum: {
      12: { diameter: 0.081, ampacity_75: 20, resistance: 2.588 },
      10: { diameter: 0.102, ampacity_75: 30, resistance: 1.629 },
      8: { diameter: 0.128, ampacity_75: 40, resistance: 1.025 },
      6: { diameter: 0.162, ampacity_75: 50, resistance: 0.644 },
      4: { diameter: 0.204, ampacity_75: 65, resistance: 0.405 },
      2: { diameter: 0.258, ampacity_75: 90, resistance: 0.255 },
      1: { diameter: 0.289, ampacity_75: 100, resistance: 0.202 },
      '1/0': { diameter: 0.325, ampacity_75: 120, resistance: 0.160 },
      '2/0': { diameter: 0.365, ampacity_75: 135, resistance: 0.127 },
      '3/0': { diameter: 0.410, ampacity_75: 155, resistance: 0.101 },
      '4/0': { diameter: 0.460, ampacity_75: 180, resistance: 0.080 }
    }
  };

  useEffect(() => {
    calculateWireSize();
  }, [loadCurrent, systemVoltage, wireLength, voltageDrop, wireMaterial, installMethod, temperature]);

  const calculateWireSize = () => {
    const current = parseFloat(loadCurrent) || 0;
    const voltage = parseFloat(systemVoltage);
    const length = parseFloat(wireLength) || 0;
    const maxVoltageDrop = parseFloat(voltageDrop) / 100;
    const material = wireMaterial;
    const method = installMethod;
    const temp = parseFloat(temperature) || 86;

    if (current <= 0 || length <= 0) {
      resetResults();
      return;
    }

    // Calculate required ampacity with safety factor
    const requiredAmpacity = current * 1.25; // 125% safety factor

    // Apply temperature derating
    let tempFactor = 1.0;
    if (temp > 86) {
      tempFactor = 0.82; // Simplified derating for high temps
    }

    // Apply installation method derating
    let installFactor = 1.0;
    switch (method) {
      case 'free-air': installFactor = 1.0; break;
      case 'conduit': installFactor = 0.8; break;
      case 'bundle': installFactor = 0.7; break;
      case 'buried': installFactor = 0.9; break;
    }

    const adjustedAmpacity = requiredAmpacity / (tempFactor * installFactor);

    // Find minimum wire size based on ampacity
    const materialData = wireData[material];
    let minWireByAmpacity: string | null = null;

    for (const [awg, data] of Object.entries(materialData)) {
      if (data.ampacity_75 >= adjustedAmpacity) {
        minWireByAmpacity = awg;
        break;
      }
    }

    // Calculate minimum wire size based on voltage drop
    const maxAllowedResistance = (maxVoltageDrop * voltage) / (2 * current * length / 1000);
    let minWireByVoltageDrop: string | null = null;

    for (const [awg, data] of Object.entries(materialData)) {
      if (data.resistance <= maxAllowedResistance) {
        minWireByVoltageDrop = awg;
        break;
      }
    }

    // Select the larger (safer) wire size
    const recommended = getLargerWire(minWireByAmpacity, minWireByVoltageDrop, materialData);

    if (!recommended || !materialData[recommended]) {
      resetResults();
      return;
    }

    const wireInfo = materialData[recommended];
    const calcActualVoltageDrop = (2 * current * length * wireInfo.resistance / 1000) / voltage * 100;
    const calcVoltageAtLoad = voltage * (1 - calcActualVoltageDrop / 100);

    // Update display
    setRecommendedWire(`${recommended} AWG`);
    setMinimumAWG(`${minWireByAmpacity || 'N/A'} AWG (ampacity)`);
    setAmpacityRating(`${wireInfo.ampacity_75} Amps`);
    setActualVoltageDrop(`${calcActualVoltageDrop.toFixed(2)}%`);
    setVoltageAtLoad(`${calcVoltageAtLoad.toFixed(1)}V`);
    setWireDiameter(`${wireInfo.diameter.toFixed(3)} inches`);

    // Color code voltage drop
    if (calcActualVoltageDrop <= 3) {
      setVoltageDropColor('text-green-600');
    } else if (calcActualVoltageDrop <= 5) {
      setVoltageDropColor('text-yellow-600');
    } else {
      setVoltageDropColor('text-red-600');
    }
  };

  const getLargerWire = (wire1: string | null, wire2: string | null, materialData: WireData): string | null => {
    if (!wire1) return wire2;
    if (!wire2) return wire1;

    const wireOrder = Object.keys(materialData);
    const index1 = wireOrder.indexOf(wire1);
    const index2 = wireOrder.indexOf(wire2);

    // Return the wire that appears first in the array (larger gauge)
    return index1 <= index2 ? wire1 : wire2;
  };

  const resetResults = () => {
    setRecommendedWire('-- AWG');
    setMinimumAWG('-- AWG');
    setAmpacityRating('-- Amps');
    setActualVoltageDrop('--%');
    setVoltageDropColor('text-gray-600');
    setVoltageAtLoad('--V');
    setWireDiameter('-- inches');
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Wire Size Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate proper AWG wire gauge for electrical circuits based on amperage and voltage drop</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Circuit Specifications</h2>

            {/* Load Current */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Load Current (Amps)</label>
              <input
                type="number"
                value={loadCurrent}
                onChange={(e) => setLoadCurrent(e.target.value)}
                step="0.1"
                placeholder="e.g., 20"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* System Voltage */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">System Voltage</label>
              <select
                value={systemVoltage}
                onChange={(e) => setSystemVoltage(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="12">12V DC</option>
                <option value="24">24V DC</option>
                <option value="120">120V AC</option>
                <option value="240">240V AC</option>
                <option value="277">277V AC</option>
                <option value="480">480V AC</option>
              </select>
            </div>

            {/* Wire Length */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">One-Way Distance (feet)</label>
              <input
                type="number"
                value={wireLength}
                onChange={(e) => setWireLength(e.target.value)}
                step="1"
                placeholder="e.g., 100"
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Maximum Voltage Drop */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Voltage Drop (%)</label>
              <select
                value={voltageDrop}
                onChange={(e) => setVoltageDrop(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="2">2% - Critical circuits</option>
                <option value="3">3% - Branch circuits (NEC recommended)</option>
                <option value="5">5% - Feeders (NEC maximum)</option>
                <option value="10">10% - Low voltage DC systems</option>
              </select>
            </div>

            {/* Wire Material */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Wire Material</label>
              <select
                value={wireMaterial}
                onChange={(e) => setWireMaterial(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="copper">Copper</option>
                <option value="aluminum">Aluminum</option>
              </select>
            </div>

            {/* Installation Method */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Installation Method</h4>
              <select
                value={installMethod}
                onChange={(e) => setInstallMethod(e.target.value)}
                className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="free-air">Free air (single cable)</option>
                <option value="conduit">Conduit/raceway (up to 3 cables)</option>
                <option value="bundle">Cable bundle (4+ cables)</option>
                <option value="buried">Direct buried</option>
              </select>
            </div>

            {/* Temperature */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Ambient Temperature (°F)</label>
              <input
                type="number"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Wire Size Results</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600">{recommendedWire}</div>
                <div className="text-green-700">Recommended Wire Size</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Minimum AWG:</span>
                  <span className="font-semibold">{minimumAWG}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Ampacity Rating:</span>
                  <span className="font-semibold">{ampacityRating}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Actual Voltage Drop:</span>
                  <span className={`font-semibold ${voltageDropColor}`}>{actualVoltageDrop}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Voltage at Load:</span>
                  <span className="font-semibold">{voltageAtLoad}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Wire Diameter:</span>
                  <span className="font-semibold">{wireDiameter}</span>
                </div>
              </div>
            </div>

            {/* Safety Notice */}
            <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-800 mb-2">⚠️ Safety Notice</h4>
              <div className="text-red-700 text-sm space-y-1">
                <div>• Always consult local electrical codes</div>
                <div>• Hire qualified electrician for installations</div>
                <div>• Consider derating factors</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* AWG Reference Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">AWG Wire Size Reference</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
          <div>
            <h4 className="font-semibold text-purple-700 mb-3">Copper Wire Ampacity (75°C)</h4>
            <div className="space-y-2 text-sm text-purple-600">
              <div className="grid grid-cols-3 gap-4 font-semibold border-b pb-2">
                <span>AWG</span><span>Diameter</span><span>Ampacity</span>
              </div>
              <div className="grid grid-cols-3 gap-4"><span>14</span><span>0.064&quot;</span><span>20A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>12</span><span>0.081&quot;</span><span>25A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>10</span><span>0.102&quot;</span><span>35A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>8</span><span>0.128&quot;</span><span>50A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>6</span><span>0.162&quot;</span><span>65A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>4</span><span>0.204&quot;</span><span>85A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>2</span><span>0.258&quot;</span><span>115A</span></div>
              <div className="grid grid-cols-3 gap-4"><span>1/0</span><span>0.325&quot;</span><span>150A</span></div>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-purple-700 mb-3">Voltage Drop Guidelines</h4>
            <div className="text-purple-600 space-y-2 text-sm">
              <div><strong>NEC Recommendations:</strong></div>
              <div>• Branch circuits: 3% maximum</div>
              <div>• Feeders: 5% maximum</div>
              <div>• Combined: 5% maximum total</div>
              <div className="mt-3"><strong>Critical Applications:</strong></div>
              <div>• Medical equipment: 2% max</div>
              <div>• Emergency systems: 2% max</div>
              <div>• Motor starting: Consider inrush</div>
              <div className="mt-3"><strong>DC Systems:</strong></div>
              <div>• 12V: Often 3-5% acceptable</div>
              <div>• 24V+: Follow AC guidelines</div>
            </div>
          </div>
        </div>
      </div>

      {/* Installation Guidelines */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Wire Installation Guidelines</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Conduit Fill</h4>
            <ul className="text-sm space-y-1">
              <li>• 1 wire: 53% max fill</li>
              <li>• 2 wires: 31% max fill</li>
              <li>• 3+ wires: 40% max fill</li>
              <li>• Use conduit fill tables</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Temperature Derating</h4>
            <ul className="text-sm space-y-1">
              <li>• Above 86°F: Derate ampacity</li>
              <li>• Bundle adjustment required</li>
              <li>• Consider heat sources</li>
              <li>• Use manufacturer data</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Special Considerations</h4>
            <ul className="text-sm space-y-1">
              <li>• Motor loads: 125% factor</li>
              <li>• Continuous loads: 125% factor</li>
              <li>• HVAC equipment: Special rules</li>
              <li>• Check local amendments</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block p-3 sm:p-4 md:p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="wire-size-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
