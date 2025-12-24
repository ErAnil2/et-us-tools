'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

type EnergyUnit = 'joules' | 'kilojoules' | 'calories' | 'kilocalories' | 'kwh' | 'btu' | 'ev' | 'foot_pounds';
type MassUnit = 'kg' | 'g' | 'lb' | 'oz';
type VelocityUnit = 'm_s' | 'km_h' | 'mph' | 'ft_s';

// Fallback FAQs for Kinetic Energy Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'What is kinetic energy and how is it calculated?',
    answer: 'Kinetic energy is the energy an object possesses due to its motion. It is calculated using the formula KE = ½mv², where m is the mass of the object in kilograms and v is its velocity in meters per second. The result is expressed in Joules (J). For example, a 2 kg object moving at 10 m/s has a kinetic energy of ½ × 2 × 10² = 100 Joules.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'Why is velocity squared in the kinetic energy formula?',
    answer: 'Velocity is squared in the kinetic energy formula because kinetic energy is derived from the work-energy theorem. When you accelerate an object, the work done (force × distance) relates to velocity squared through the equations of motion. This means doubling velocity quadruples kinetic energy - a car at 60 mph has four times the kinetic energy of the same car at 30 mph, which is why high-speed collisions are so much more destructive.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'What is the difference between kinetic and potential energy?',
    answer: 'Kinetic energy is energy of motion - it depends on an object\'s mass and velocity. Potential energy is stored energy based on position or configuration - gravitational potential energy depends on height, while elastic potential energy is stored in stretched or compressed materials. These two forms can convert into each other, like a roller coaster converting potential energy at the top of a hill into kinetic energy at the bottom.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'What units are used to measure kinetic energy?',
    answer: 'The SI unit for kinetic energy is the Joule (J), equal to one kilogram-meter squared per second squared (kg⋅m²/s²). Other common units include: kilojoules (kJ = 1000 J), calories (1 cal = 4.184 J), kilowatt-hours (1 kWh = 3.6 million J), British Thermal Units (1 BTU = 1055 J), and electron volts (1 eV = 1.6×10⁻¹⁹ J) for atomic-scale energies.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'How does kinetic energy affect vehicle safety?',
    answer: 'Kinetic energy is crucial in vehicle safety because it determines the energy that must be dissipated in a crash. Since KE is proportional to velocity squared, a car at 60 mph has four times the kinetic energy of one at 30 mph. This is why speed limits exist, why crumple zones are designed to absorb energy gradually, and why even small increases in speed dramatically increase accident severity and stopping distances.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'Can kinetic energy ever be negative?',
    answer: 'No, kinetic energy can never be negative. Since KE = ½mv², and mass is always positive and velocity is squared (making it always positive regardless of direction), kinetic energy is always zero or positive. An object at rest has zero kinetic energy. The direction of motion doesn\'t affect kinetic energy - only the speed matters. This is why kinetic energy is called a scalar quantity, not a vector.',
    order: 6,
  },
];

// Object presets with realistic values
const objectPresets = [
  { name: 'Walking Person', mass: 70, velocity: 1.4, massUnit: 'kg' as MassUnit, velocityUnit: 'm_s' as VelocityUnit, icon: '🚶' },
  { name: 'Running Person', mass: 70, velocity: 8, massUnit: 'kg' as MassUnit, velocityUnit: 'm_s' as VelocityUnit, icon: '🏃' },
  { name: 'Cycling', mass: 80, velocity: 25, massUnit: 'kg' as MassUnit, velocityUnit: 'km_h' as VelocityUnit, icon: '🚴' },
  { name: 'Baseball Pitch', mass: 145, velocity: 95, massUnit: 'g' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '⚾' },
  { name: 'Soccer Ball Kick', mass: 430, velocity: 30, massUnit: 'g' as MassUnit, velocityUnit: 'm_s' as VelocityUnit, icon: '⚽' },
  { name: 'Tennis Serve', mass: 58, velocity: 130, massUnit: 'g' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '🎾' },
  { name: 'Golf Ball Drive', mass: 46, velocity: 170, massUnit: 'g' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '🏌️' },
  { name: 'Car (City)', mass: 1500, velocity: 30, massUnit: 'kg' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '🚗' },
  { name: 'Car (Highway)', mass: 1500, velocity: 70, massUnit: 'kg' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '🚙' },
  { name: 'Truck', mass: 10000, velocity: 60, massUnit: 'kg' as MassUnit, velocityUnit: 'mph' as VelocityUnit, icon: '🚛' },
  { name: 'Bullet (9mm)', mass: 8, velocity: 375, massUnit: 'g' as MassUnit, velocityUnit: 'm_s' as VelocityUnit, icon: '🔫' },
  { name: 'Commercial Jet', mass: 300000, velocity: 900, massUnit: 'kg' as MassUnit, velocityUnit: 'km_h' as VelocityUnit, icon: '✈️' },
];

export default function KineticEnergyCalculatorClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('kinetic-energy-calculator');

  // Input state
  const [mass, setMass] = useState<number>(2);
  const [velocity, setVelocity] = useState<number>(10);
  const [massUnit, setMassUnit] = useState<MassUnit>('kg');
  const [velocityUnit, setVelocityUnit] = useState<VelocityUnit>('m_s');
  const [energyUnit, setEnergyUnit] = useState<EnergyUnit>('joules');

  // Results state
  const [kineticEnergy, setKineticEnergy] = useState<number>(0);
  const [momentum, setMomentum] = useState<number>(0);
  const [massInKg, setMassInKg] = useState<number>(0);
  const [velocityInMs, setVelocityInMs] = useState<number>(0);

  // Unit conversion functions
  const convertMassToKg = (value: number, unit: MassUnit): number => {
    switch (unit) {
      case 'g': return value / 1000;
      case 'lb': return value * 0.453592;
      case 'oz': return value * 0.0283495;
      default: return value;
    }
  };

  const convertVelocityToMs = (value: number, unit: VelocityUnit): number => {
    switch (unit) {
      case 'km_h': return value / 3.6;
      case 'mph': return value * 0.44704;
      case 'ft_s': return value * 0.3048;
      default: return value;
    }
  };

  const convertEnergyFromJoules = (joules: number, unit: EnergyUnit): { value: number; label: string } => {
    switch (unit) {
      case 'kilojoules': return { value: joules / 1000, label: 'kJ' };
      case 'calories': return { value: joules * 0.239006, label: 'cal' };
      case 'kilocalories': return { value: joules * 0.000239006, label: 'kcal' };
      case 'kwh': return { value: joules / 3600000, label: 'kWh' };
      case 'btu': return { value: joules * 0.000947817, label: 'BTU' };
      case 'ev': return { value: joules * 6.242e18, label: 'eV' };
      case 'foot_pounds': return { value: joules * 0.737562, label: 'ft⋅lb' };
      default: return { value: joules, label: 'J' };
    }
  };

  // Calculate kinetic energy and related values
  useEffect(() => {
    const mKg = convertMassToKg(mass, massUnit);
    const vMs = convertVelocityToMs(velocity, velocityUnit);

    setMassInKg(mKg);
    setVelocityInMs(vMs);

    // KE = ½mv²
    const ke = 0.5 * mKg * vMs * vMs;
    setKineticEnergy(ke);

    // Momentum = mv
    const p = mKg * vMs;
    setMomentum(p);
  }, [mass, velocity, massUnit, velocityUnit]);

  // Apply preset
  const applyPreset = (preset: typeof objectPresets[0]) => {
    setMass(preset.mass);
    setMassUnit(preset.massUnit);
    setVelocity(preset.velocity);
    setVelocityUnit(preset.velocityUnit);
  };

  // Format energy display
  const formatEnergy = (joules: number): string => {
    if (joules === 0) return '0';
    if (joules >= 1e9) return `${(joules / 1e9).toFixed(2)} GJ`;
    if (joules >= 1e6) return `${(joules / 1e6).toFixed(2)} MJ`;
    if (joules >= 1e3) return `${(joules / 1e3).toFixed(2)} kJ`;
    if (joules >= 1) return `${joules.toFixed(2)} J`;
    if (joules >= 1e-3) return `${(joules * 1e3).toFixed(2)} mJ`;
    return joules.toExponential(3) + ' J';
  };

  const convertedEnergy = convertEnergyFromJoules(kineticEnergy, energyUnit);

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Kinetic Energy Calculator",
    "description": "Calculate kinetic energy from mass and velocity using the formula KE = ½mv². Convert between energy units and explore real-world examples.",
    "url": "https://www.example.com/us/tools/calculators/kinetic-energy-calculator",
    "applicationCategory": "Physics Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 py-4 sm:py-6 md:py-8">
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
            {getH1('Kinetic Energy Calculator')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading('Calculate kinetic energy from mass and velocity using the formula KE = ½mv²')}
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
                <span className="text-2xl">⚡</span> Kinetic Energy Calculator
              </h2>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Input Parameters */}
                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-4 text-purple-800">Input Parameters</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mass (m)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={mass}
                          onChange={(e) => setMass(parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                          step="0.1"
                          min="0"
                        />
                        <select
                          value={massUnit}
                          onChange={(e) => setMassUnit(e.target.value as MassUnit)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="kg">kg</option>
                          <option value="g">g</option>
                          <option value="lb">lb</option>
                          <option value="oz">oz</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Velocity (v)
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="number"
                          value={velocity}
                          onChange={(e) => setVelocity(parseFloat(e.target.value) || 0)}
                          className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-lg"
                          step="0.1"
                        />
                        <select
                          value={velocityUnit}
                          onChange={(e) => setVelocityUnit(e.target.value as VelocityUnit)}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="m_s">m/s</option>
                          <option value="km_h">km/h</option>
                          <option value="mph">mph</option>
                          <option value="ft_s">ft/s</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Show converted values */}
                  <div className="mt-3 text-sm text-purple-600 flex gap-3 sm:gap-4 md:gap-6">
                    <span>= {massInKg.toFixed(4)} kg</span>
                    <span>= {velocityInMs.toFixed(2)} m/s</span>
                  </div>
                </div>

                {/* Object Presets */}
                <div className="bg-blue-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-blue-800">Quick Presets - Select an Object</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                    {objectPresets.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => applyPreset(preset)}
                        className="p-2 bg-white hover:bg-blue-100 border border-blue-200 rounded-lg transition text-center"
                        title={`${preset.name}: ${preset.mass} ${preset.massUnit}, ${preset.velocity} ${preset.velocityUnit}`}
                      >
                        <div className="text-xl">{preset.icon}</div>
                        <div className="text-xs text-gray-600 truncate">{preset.name}</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Energy Unit Selection */}
                <div className="bg-green-50 rounded-lg p-5">
                  <h3 className="font-semibold mb-3 text-green-800">Output Energy Unit</h3>
                  <select
                    value={energyUnit}
                    onChange={(e) => setEnergyUnit(e.target.value as EnergyUnit)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  >
                    <option value="joules">Joules (J)</option>
                    <option value="kilojoules">Kilojoules (kJ)</option>
                    <option value="calories">Calories (cal)</option>
                    <option value="kilocalories">Kilocalories (kcal / food calories)</option>
                    <option value="kwh">Kilowatt-hours (kWh)</option>
                    <option value="btu">British Thermal Units (BTU)</option>
                    <option value="foot_pounds">Foot-pounds (ft⋅lb)</option>
                    <option value="ev">Electron volts (eV)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Understanding Kinetic Energy */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Kinetic Energy</h3>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">What is Kinetic Energy?</h4>
                    <p className="text-sm text-purple-700">
                      Kinetic energy is the energy possessed by an object due to its motion.
                      It depends on both the mass and velocity of the object, increasing with the square of velocity.
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">The Formula</h4>
                    <div className="text-2xl font-mono text-blue-600 mb-2 text-center">KE = ½mv²</div>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• <strong>KE</strong> = Kinetic Energy (Joules)</li>
                      <li>• <strong>m</strong> = Mass (kilograms)</li>
                      <li>• <strong>v</strong> = Velocity (meters/second)</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Key Properties</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Always positive (scalar quantity)</li>
                      <li>• Directly proportional to mass</li>
                      <li>• Proportional to velocity squared</li>
                      <li>• Can be transferred but not created</li>
                      <li>• SI unit: Joules (J = kg⋅m²/s²)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Real Applications</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Vehicle crash analysis & safety</li>
                      <li>• Ballistics and projectile motion</li>
                      <li>• Sports performance analysis</li>
                      <li>• Wind & hydroelectric power</li>
                      <li>• Roller coaster design</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Speed Impact Visualization */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Why Velocity Matters More</h3>
              <p className="text-gray-600 mb-4">
                Since kinetic energy is proportional to velocity squared, doubling speed quadruples energy:
              </p>
              <div className="grid grid-cols-4 gap-3 text-center">
                {[1, 2, 3, 4].map((multiplier) => (
                  <div key={multiplier} className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg p-3">
                    <div className="text-lg font-bold text-orange-600">{multiplier}× speed</div>
                    <div className="text-2xl font-bold text-red-600">{multiplier * multiplier}× energy</div>
                  </div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-3">
                This is why speeding is so dangerous - a car at 60 mph has 4× the kinetic energy of one at 30 mph!
              </p>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <CalculatorMobileMrec2 />



            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Main Results */}
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Results
              </h3>

              <div className="space-y-4">
                {/* Primary Energy Display */}
                <div className="text-center p-5 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-xl text-white">
                  <div className="text-sm text-purple-200 mb-1">Kinetic Energy</div>
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold">{formatEnergy(kineticEnergy)}</div>
                  {energyUnit !== 'joules' && (
                    <div className="text-lg mt-2 text-purple-100">
                      = {convertedEnergy.value.toExponential(3)} {convertedEnergy.label}
                    </div>
                  )}
                </div>

                {/* Input Summary */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-lg font-bold text-blue-600">{mass} {massUnit}</div>
                    <div className="text-xs text-blue-700">Mass</div>
                    <div className="text-xs text-blue-500">({massInKg.toFixed(3)} kg)</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-lg font-bold text-green-600">{velocity} {velocityUnit.replace('_', '/')}</div>
                    <div className="text-xs text-green-700">Velocity</div>
                    <div className="text-xs text-green-500">({velocityInMs.toFixed(2)} m/s)</div>
                  </div>
                </div>

                {/* Momentum */}
                <div className="p-3 bg-orange-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-orange-700">Momentum (p = mv)</span>
                    <span className="font-bold text-orange-600">{momentum.toFixed(2)} kg⋅m/s</span>
                  </div>
                </div>

                {/* Formula Display */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-gray-700 mb-2 text-sm">Calculation</h4>
                  <div className="text-sm text-gray-600 space-y-1 font-mono">
                    <div>KE = ½ × m × v²</div>
                    <div>KE = ½ × {massInKg.toFixed(3)} × {velocityInMs.toFixed(2)}²</div>
                    <div>KE = ½ × {massInKg.toFixed(3)} × {(velocityInMs * velocityInMs).toFixed(2)}</div>
                    <div className="font-bold text-purple-600">KE = {kineticEnergy.toFixed(2)} J</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Energy Unit Conversions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-3">Energy Conversions</h3>
              <div className="space-y-2 text-sm">
                {[
                  { unit: 'Joules', value: kineticEnergy, suffix: 'J' },
                  { unit: 'Kilojoules', value: kineticEnergy / 1000, suffix: 'kJ' },
                  { unit: 'Calories', value: kineticEnergy * 0.239006, suffix: 'cal' },
                  { unit: 'Kilocalories', value: kineticEnergy * 0.000239006, suffix: 'kcal' },
                  { unit: 'kWh', value: kineticEnergy / 3600000, suffix: 'kWh' },
                  { unit: 'BTU', value: kineticEnergy * 0.000947817, suffix: 'BTU' },
                  { unit: 'Foot-pounds', value: kineticEnergy * 0.737562, suffix: 'ft⋅lb' },
                ].map((conv) => (
                  <div key={conv.unit} className="flex justify-between items-center py-1 border-b border-blue-100">
                    <span className="text-blue-700">{conv.unit}</span>
                    <span className="font-medium text-blue-800">
                      {conv.value >= 0.01 && conv.value < 10000
                        ? conv.value.toFixed(2)
                        : conv.value.toExponential(2)} {conv.suffix}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-purple-800 mb-3">Quick Reference</h3>
              <div className="space-y-2 text-sm text-purple-700">
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>1 J = 1 kg⋅m²/s²</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>1 cal = 4.184 J</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>1 kWh = 3.6 MJ</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>1 BTU = 1055 J</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-500 mt-0.5">•</span>
                  <span>1 ft⋅lb = 1.356 J</span>
                </div>
              </div>
            </div>

            {/* Related Formulas */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green-800 mb-3">Related Formulas</h3>
              <div className="space-y-3 text-sm">
                <div className="bg-white/50 rounded p-2">
                  <div className="font-mono text-green-700">KE = ½mv²</div>
                  <div className="text-xs text-green-600">Kinetic Energy</div>
                </div>
                <div className="bg-white/50 rounded p-2">
                  <div className="font-mono text-green-700">PE = mgh</div>
                  <div className="text-xs text-green-600">Potential Energy</div>
                </div>
                <div className="bg-white/50 rounded p-2">
                  <div className="font-mono text-green-700">p = mv</div>
                  <div className="text-xs text-green-600">Momentum</div>
                </div>
                <div className="bg-white/50 rounded p-2">
                  <div className="font-mono text-green-700">W = Fd</div>
                  <div className="text-xs text-green-600">Work</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
