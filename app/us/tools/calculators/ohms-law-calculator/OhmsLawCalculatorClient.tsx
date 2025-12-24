'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
type CalculationMode = 'voltage' | 'current' | 'resistance';

interface CircuitPreset {
  voltage: number;
  resistance: number;
  name: string;
  icon: string;
}

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface OhmsLawCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// Fallback FAQs for Ohm's Law Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: "What is Ohm's Law and what is the formula?",
    answer: "Ohm's Law describes the relationship between voltage (V), current (I), and resistance (R) in an electrical circuit. The formula is V = I × R, where voltage equals current times resistance. This can be rearranged to find current (I = V/R) or resistance (R = V/I). Named after German physicist Georg Ohm, this fundamental law applies to most conductive materials at constant temperature.",
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'How do I calculate the current in a circuit?',
    answer: "To calculate current using Ohm's Law, divide the voltage by the resistance: I = V/R. For example, if you have a 12V battery connected to a 100Ω resistor, the current would be 12V ÷ 100Ω = 0.12A (120 milliamps). Current is measured in amperes (A), with smaller currents expressed in milliamps (mA) or microamps (µA).",
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'What is the relationship between voltage, current, and power?',
    answer: 'Power (P) in a circuit equals voltage times current: P = V × I (measured in watts). Using Ohm\'s Law, this can also be expressed as P = I²R or P = V²/R. For example, a 120V circuit drawing 10A consumes 1200W of power. Understanding power is crucial for sizing components, calculating electricity costs, and ensuring safety.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'What is electrical resistance and what affects it?',
    answer: 'Resistance is the opposition to current flow, measured in ohms (Ω). It depends on: material type (copper has low resistance, rubber has high), length (longer wires have more resistance), cross-sectional area (thicker wires have less resistance), and temperature (most metals increase resistance when heated). Resistors are components designed to provide specific resistance values.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: "When does Ohm's Law not apply?",
    answer: "Ohm's Law only applies to \"ohmic\" materials where resistance remains constant. It doesn't apply to: semiconductor devices (diodes, transistors), light bulbs (resistance changes with temperature), superconductors (zero resistance below critical temperature), and non-linear devices. For these components, the V-I relationship is more complex and varies with operating conditions.",
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'How do I choose the right resistor for an LED circuit?',
    answer: 'To calculate the resistor needed for an LED: R = (V_supply - V_LED) / I_LED. For example, with a 5V supply, an LED with 2V forward voltage and 20mA desired current: R = (5V - 2V) / 0.020A = 150Ω. Always choose the next higher standard resistor value for safety. The resistor wattage should exceed P = I²R to prevent overheating.',
    order: 6,
  },
];

// Circuit presets
const circuitPresets: Record<string, CircuitPreset> = {
  led: { voltage: 3.3, resistance: 150, name: 'LED Circuit', icon: '💡' },
  usb: { voltage: 5, resistance: 500, name: 'USB Device', icon: '🔌' },
  battery9v: { voltage: 9, resistance: 100, name: '9V Battery Test', icon: '🔋' },
  car: { voltage: 12, resistance: 24, name: 'Car Circuit', icon: '🚗' },
  household: { voltage: 120, resistance: 12, name: 'Household (US)', icon: '🏠' },
  industrial: { voltage: 240, resistance: 20, name: 'Industrial', icon: '🏭' },
};

export default function OhmsLawCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: OhmsLawCalculatorClientProps) {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('ohms-law-calculator');

  const [voltage, setVoltage] = useState<string>('12');
  const [current, setCurrent] = useState<string>('');
  const [resistance, setResistance] = useState<string>('100');
  const [currentMode, setCurrentMode] = useState<CalculationMode>('current');

  const handleSetCalculationMode = (mode: CalculationMode) => {
    setCurrentMode(mode);
    if (mode === 'voltage') setVoltage('');
    if (mode === 'current') setCurrent('');
    if (mode === 'resistance') setResistance('');
  };

  const handleSetCircuitPreset = (type: string) => {
    const preset = circuitPresets[type];
    setVoltage(preset.voltage.toString());
    setResistance(preset.resistance.toString());
    handleSetCalculationMode('current');
  };

  const calculateOhmsLaw = () => {
    const voltageVal = parseFloat(voltage) || 0;
    const currentVal = parseFloat(current) || 0;
    const resistanceVal = parseFloat(resistance) || 0;

    switch(currentMode) {
      case 'voltage':
        if (currentVal > 0 && resistanceVal > 0) {
          const calculatedV = currentVal * resistanceVal;
          setVoltage(calculatedV.toFixed(3));
        }
        break;
      case 'current':
        if (voltageVal > 0 && resistanceVal > 0) {
          const calculatedI = voltageVal / resistanceVal;
          setCurrent(calculatedI.toFixed(6));
        }
        break;
      case 'resistance':
        if (voltageVal > 0 && currentVal > 0) {
          const calculatedR = voltageVal / currentVal;
          setResistance(calculatedR.toFixed(3));
        }
        break;
    }
  };

  useEffect(() => {
    handleSetCalculationMode('current');
  }, []);

  useEffect(() => {
    calculateOhmsLaw();
  }, [voltage, current, resistance, currentMode]);

  // Calculate display values
  const voltageVal = parseFloat(voltage) || 0;
  const currentVal = parseFloat(current) || 0;
  const resistanceVal = parseFloat(resistance) || 0;
  const power = voltageVal * currentVal;

  // Current in different units
  const currentInMA = currentVal * 1000;
  const currentInUA = currentVal * 1000000;

  // Generate formula display
  const getFormulaDisplay = () => {
    switch(currentMode) {
      case 'voltage':
        return {
          formula: 'V = I × R',
          calculation: `${voltageVal.toFixed(2)} = ${currentVal.toFixed(4)} × ${resistanceVal.toFixed(1)}`
        };
      case 'current':
        return {
          formula: 'I = V / R',
          calculation: `${currentVal.toFixed(4)} = ${voltageVal.toFixed(2)} / ${resistanceVal.toFixed(1)}`
        };
      case 'resistance':
        return {
          formula: 'R = V / I',
          calculation: `${resistanceVal.toFixed(1)} = ${voltageVal.toFixed(2)} / ${currentVal.toFixed(4)}`
        };
    }
  };

  const formulaDisplay = getFormulaDisplay();

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Ohm's Law Calculator",
    "description": "Calculate voltage, current, and resistance using Ohm's Law (V = IR). Free online electrical calculator for circuits and electronics.",
    "url": "https://www.example.com/us/tools/calculators/ohms-law-calculator",
    "applicationCategory": "Electrical Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-100 py-4 sm:py-6 md:py-8">
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
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {getH1("Ohm's Law Calculator")}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading('Calculate voltage, current, and resistance using V = IR')}
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
                <span className="text-2xl">⚡</span> Ohm's Law Calculator
              </h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Circuit Presets */}
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-green-800">Circuit Presets</h3>
                  <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                    {Object.entries(circuitPresets).map(([key, preset]) => (
                      <button
                        key={key}
                        onClick={() => handleSetCircuitPreset(key)}
                        className="p-3 bg-white hover:bg-green-100 border border-green-200 rounded-lg transition text-center"
                        title={`${preset.voltage}V, ${preset.resistance}Ω`}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-xs text-gray-700 font-medium truncate">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Input Parameters */}
                <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-amber-800">Circuit Parameters</h3>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Voltage (V) - Volts
                      </label>
                      <input
                        type="number"
                        value={voltage}
                        onChange={(e) => setVoltage(e.target.value)}
                        disabled={currentMode === 'voltage'}
                        step="0.1"
                        min="0"
                        placeholder="Auto-calculated"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 text-lg ${
                          currentMode === 'voltage' ? 'bg-yellow-100 border-yellow-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Current (I) - Amperes
                      </label>
                      <input
                        type="number"
                        value={current}
                        onChange={(e) => setCurrent(e.target.value)}
                        disabled={currentMode === 'current'}
                        step="0.001"
                        placeholder="Auto-calculated"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg ${
                          currentMode === 'current' ? 'bg-blue-100 border-blue-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resistance (R) - Ohms
                      </label>
                      <input
                        type="number"
                        value={resistance}
                        onChange={(e) => setResistance(e.target.value)}
                        disabled={currentMode === 'resistance'}
                        step="0.1"
                        min="0"
                        placeholder="Auto-calculated"
                        className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg ${
                          currentMode === 'resistance' ? 'bg-green-100 border-green-300' : 'border-gray-300'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Calculation Mode */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-blue-800">What do you want to calculate?</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { mode: 'voltage' as CalculationMode, label: 'Voltage (V)', icon: '⚡', formula: 'V = I × R' },
                      { mode: 'current' as CalculationMode, label: 'Current (I)', icon: '🔌', formula: 'I = V / R' },
                      { mode: 'resistance' as CalculationMode, label: 'Resistance (R)', icon: '🔧', formula: 'R = V / I' },
                    ].map((option) => (
                      <button
                        key={option.mode}
                        onClick={() => handleSetCalculationMode(option.mode)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          currentMode === option.mode
                            ? 'border-blue-500 bg-blue-100 shadow-md'
                            : 'border-gray-200 hover:border-blue-300 bg-white'
                        }`}
                      >
                        <div className="text-2xl mb-1">{option.icon}</div>
                        <div className="font-semibold text-sm">{option.label}</div>
                        <div className="text-xs text-gray-500 font-mono mt-1">{option.formula}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Understanding Ohm's Law */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Ohm's Law</h3>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <h4 className="font-semibold text-yellow-800 mb-2">Ohm's Law Formula</h4>
                    <div className="text-xl sm:text-2xl md:text-3xl font-mono text-yellow-600 mb-2 text-center">V = I × R</div>
                    <p className="text-sm text-yellow-700">Voltage equals current times resistance</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-2">Alternative Forms</h4>
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-yellow-100 rounded">
                        <div className="font-mono text-yellow-700">V = IR</div>
                        <div className="text-xs text-gray-600">Voltage</div>
                      </div>
                      <div className="p-2 bg-blue-100 rounded">
                        <div className="font-mono text-blue-700">I = V/R</div>
                        <div className="text-xs text-gray-600">Current</div>
                      </div>
                      <div className="p-2 bg-green-100 rounded">
                        <div className="font-mono text-green-700">R = V/I</div>
                        <div className="text-xs text-gray-600">Resistance</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-3">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-semibold text-yellow-800 text-sm">Voltage (V)</h4>
                      <p className="text-xs text-yellow-700">Electric potential difference measured in volts (V). The "push" that moves electrons through a circuit.</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 text-sm">Current (I)</h4>
                      <p className="text-xs text-blue-700">Flow of electric charge measured in amperes (A). One amp = one coulomb of charge per second.</p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 text-sm">Resistance (R)</h4>
                      <p className="text-xs text-green-700">Opposition to current flow measured in ohms (Ω). Higher resistance = less current for same voltage.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Power Formulas */}
              <div className="mt-6 p-4 bg-purple-50 rounded-lg">
                <h4 className="font-semibold text-purple-800 mb-3">Power Formulas (P = Watts)</h4>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div className="p-2 bg-white rounded shadow-sm">
                    <div className="font-mono text-purple-700">P = V × I</div>
                    <div className="text-xs text-gray-600">Power from V & I</div>
                  </div>
<div className="p-2 bg-white rounded shadow-sm">
                    <div className="font-mono text-purple-700">P = I² × R</div>
                    <div className="text-xs text-gray-600">Power from I & R</div>
                  </div>
                  <div className="p-2 bg-white rounded shadow-sm">
                    <div className="font-mono text-purple-700">P = V² / R</div>
                    <div className="text-xs text-gray-600">Power from V & R</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Common Circuit Examples */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Common Circuit Examples</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-2">💡</div>
                  <h4 className="font-semibold text-green-800 mb-2">LED Circuit</h4>
                  <div className="text-sm text-green-700">
                    <div>Voltage: 3.3V</div>
                    <div>Current: 20mA</div>
                    <div>R = 165Ω</div>
                  </div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-2">🔋</div>
                  <h4 className="font-semibold text-blue-800 mb-2">9V Battery Test</h4>
                  <div className="text-sm text-blue-700">
                    <div>Voltage: 9V</div>
                    <div>Resistance: 1kΩ</div>
                    <div>I = 9mA</div>
                  </div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-xl sm:text-2xl md:text-3xl mb-2">🏠</div>
                  <h4 className="font-semibold text-purple-800 mb-2">Household (US)</h4>
                  <div className="text-sm text-purple-700">
                    <div>Voltage: 120V</div>
                    <div>Current: 10A</div>
                    <div>R = 12Ω, P = 1200W</div>
                  </div>
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
              <h2 className="text-xl font-bold text-gray-900 mb-4">Related Physics Calculators</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {relatedCalculators.map((calc, index) => (
                  <Link
                    key={index}
                    href={calc.href}
                    className={`${calc.color || 'bg-gray-500'} text-white p-4 rounded-lg hover:opacity-90 transition`}
                  >
                    <h3 className="font-bold mb-1">{calc.title}</h3>
                    <p className="text-sm opacity-90">{calc.description}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Circuit Results */}
            <div className="bg-white rounded-xl shadow-lg p-5">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Circuit Results
              </h3>

              <div className="space-y-4">
                {/* Main Values */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="text-center p-4 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl text-white">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold">{voltageVal.toFixed(2)} V</div>
                    <div className="text-sm text-yellow-100">Voltage</div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">{currentVal.toFixed(4)} A</div>
                      <div className="text-xs text-blue-700">Current</div>
                      <div className="text-xs text-blue-500">{currentInMA.toFixed(2)} mA</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-lg font-bold text-green-600">{resistanceVal.toFixed(1)} Ω</div>
                      <div className="text-xs text-green-700">Resistance</div>
                    </div>
                  </div>
                </div>

                {/* Power */}
                <div className="p-4 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl text-white">
                  <div className="text-sm text-purple-100 mb-1">Power (P = V × I)</div>
                  <div className="text-2xl font-bold">{power.toFixed(3)} W</div>
                  {power >= 1000 && (
                    <div className="text-sm text-purple-200">{(power / 1000).toFixed(2)} kW</div>
                  )}
                </div>

                {/* Active Formula */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-800 mb-2 text-sm">Active Formula</h4>
                  <div className="text-sm text-gray-700 font-mono">
                    <div className="text-lg text-gray-800">{formulaDisplay.formula}</div>
                    <div className="text-xs mt-1">{formulaDisplay.calculation}</div>
                  </div>
                </div>

                {/* Current Conversions */}
                <div className="p-3 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2 text-sm">Current in Different Units</h4>
                  <div className="space-y-1 text-sm text-blue-700">
                    <div className="flex justify-between">
                      <span>Amperes (A):</span>
                      <span className="font-mono">{currentVal.toFixed(6)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Milliamps (mA):</span>
                      <span className="font-mono">{currentInMA.toFixed(3)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Microamps (µA):</span>
                      <span className="font-mono">{currentInUA.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Electrical Units */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-amber-800 mb-3">Electrical Units</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-amber-200">
                  <span className="text-amber-700">Voltage (V)</span>
                  <span className="font-medium text-amber-800">Volts</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200">
                  <span className="text-amber-700">Current (I)</span>
                  <span className="font-medium text-amber-800">Amperes (A)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200">
                  <span className="text-amber-700">Resistance (R)</span>
                  <span className="font-medium text-amber-800">Ohms (Ω)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-amber-200">
                  <span className="text-amber-700">Power (P)</span>
                  <span className="font-medium text-amber-800">Watts (W)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-amber-700">Energy</span>
                  <span className="font-medium text-amber-800">Joules, kWh</span>
                </div>
              </div>
            </div>

            {/* Unit Prefixes */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green-800 mb-3">Unit Prefixes</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex justify-between">
                  <span>pico (p)</span>
                  <span className="font-mono">10⁻¹²</span>
                </div>
                <div className="flex justify-between">
                  <span>nano (n)</span>
                  <span className="font-mono">10⁻⁹</span>
                </div>
                <div className="flex justify-between">
                  <span>micro (µ)</span>
                  <span className="font-mono">10⁻⁶</span>
                </div>
                <div className="flex justify-between">
                  <span>milli (m)</span>
                  <span className="font-mono">10⁻³</span>
                </div>
                <div className="flex justify-between">
                  <span>kilo (k)</span>
                  <span className="font-mono">10³</span>
                </div>
                <div className="flex justify-between">
                  <span>mega (M)</span>
                  <span className="font-mono">10⁶</span>
                </div>
              </div>
            </div>

            {/* Wire Gauge Reference */}
            <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-orange-800 mb-3">Common Wire Gauges</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-1 border-b border-orange-200">
                  <span className="text-orange-700">14 AWG</span>
                  <span className="font-medium text-orange-800">15A circuits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-orange-200">
                  <span className="text-orange-700">12 AWG</span>
                  <span className="font-medium text-orange-800">20A circuits</span>
                </div>
                <div className="flex justify-between py-1 border-b border-orange-200">
                  <span className="text-orange-700">10 AWG</span>
                  <span className="font-medium text-orange-800">30A circuits</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-orange-700">8 AWG</span>
                  <span className="font-medium text-orange-800">40A circuits</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
