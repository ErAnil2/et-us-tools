'use client';

import React, { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner, CalculatorMobileMrec2 } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

// Fallback FAQs for Gear Ratio Calculator
const fallbackFaqs = [
  {
    id: 'faq-1',
    question: 'What is a gear ratio and how is it calculated?',
    answer: 'A gear ratio is the relationship between the number of teeth on two meshing gears. It\'s calculated by dividing the number of teeth on the driven gear by the number of teeth on the driving gear (Gear Ratio = Driven Teeth ÷ Driving Teeth). For example, if a 20-tooth gear drives a 60-tooth gear, the gear ratio is 3:1, meaning the driven gear rotates once for every three rotations of the driving gear.',
    order: 1,
  },
  {
    id: 'faq-2',
    question: 'What is the difference between speed reduction and torque multiplication?',
    answer: 'Speed reduction and torque multiplication are inversely related through gear ratios. A higher gear ratio (e.g., 4:1) reduces output speed by a factor of 4 but multiplies torque by nearly the same factor (minus efficiency losses). This is why low gears in vehicles provide more pulling power at lower speeds, while high gears provide less torque but higher speeds.',
    order: 2,
  },
  {
    id: 'faq-3',
    question: 'How do planetary gear systems work?',
    answer: 'Planetary gear systems consist of three main components: a central sun gear, planet gears that revolve around the sun, and an outer ring gear. By holding different components stationary, you can achieve various gear ratios in a compact package. They\'re commonly used in automatic transmissions, power tools, and robotics due to their high power density and efficiency.',
    order: 3,
  },
  {
    id: 'faq-4',
    question: 'What affects gear system efficiency?',
    answer: 'Gear system efficiency is affected by several factors: gear type (spur gears: 94-98%, helical: 94-98%, worm: 40-90%), lubrication quality, load conditions, alignment, material and surface finish, and operating temperature. Each gear mesh typically loses 1-3% efficiency, so compound gear trains have lower overall efficiency than simple gear pairs.',
    order: 4,
  },
  {
    id: 'faq-5',
    question: 'What is a compound gear train and when should I use one?',
    answer: 'A compound gear train uses multiple stages of gear pairs to achieve higher overall ratios that would be impractical with a single pair. For example, achieving a 100:1 ratio with one gear pair would require an impractically large driven gear, but two 10:1 stages can achieve the same ratio compactly. Compound trains are used when you need high ratios, space constraints exist, or when intermediate shafts are needed.',
    order: 5,
  },
  {
    id: 'faq-6',
    question: 'How do I choose the right gear ratio for my application?',
    answer: 'Choose a gear ratio based on your speed and torque requirements. Calculate the required output speed (RPM) from your input speed, and the torque needed at the output. Consider: the motor\'s operating range, required output characteristics, space constraints, efficiency needs, and cost. For precise positioning, lower ratios with higher precision are preferred; for high-torque applications like winches, higher ratios are better.',
    order: 6,
  },
];

export default function GearRatioCalculatorClient() {
  const { getH1, getSubHeading, getSEOContent, faqSchema } = usePageSEO('gear-ratio-calculator');

  // Calculation type
  const [calculationType, setCalculationType] = useState<string>('simple');

  // Simple gear inputs
  const [drivingTeeth, setDrivingTeeth] = useState<number>(20);
  const [drivenTeeth, setDrivenTeeth] = useState<number>(60);
  const [inputSpeed, setInputSpeed] = useState<number>(1000);
  const [inputTorque, setInputTorque] = useState<number>(10);

  // Compound gear inputs
  const [stage1Drive, setStage1Drive] = useState<number>(15);
  const [stage1Driven, setStage1Driven] = useState<number>(45);
  const [stage2Drive, setStage2Drive] = useState<number>(20);
  const [stage2Driven, setStage2Driven] = useState<number>(80);
  const [compoundInputSpeed, setCompoundInputSpeed] = useState<number>(3000);
  const [compoundInputTorque, setCompoundInputTorque] = useState<number>(5);

  // Planetary gear inputs
  const [sunTeeth, setSunTeeth] = useState<number>(20);
  const [planetTeeth, setPlanetTeeth] = useState<number>(15);
  const [ringTeeth, setRingTeeth] = useState<number>(50);
  const [planetaryConfig, setPlanetaryConfig] = useState<string>('sun_input_ring_fixed');

  // Belt/pulley inputs
  const [drivePulleyDiam, setDrivePulleyDiam] = useState<number>(100);
  const [drivenPulleyDiam, setDrivenPulleyDiam] = useState<number>(300);
  const [beltInputSpeed, setBeltInputSpeed] = useState<number>(1500);
  const [efficiency, setEfficiency] = useState<number>(95);

  // Results
  const [gearRatio, setGearRatio] = useState<number>(3);
  const [mechanicalAdvantage, setMechanicalAdvantage] = useState<number>(3);
  const [speedReduction, setSpeedReduction] = useState<number>(67);
  const [outputSpeed, setOutputSpeed] = useState<number>(333);
  const [outputTorque, setOutputTorque] = useState<number>(30);
  const [torqueMultiplication, setTorqueMultiplication] = useState<number>(3);
  const [systemEfficiency, setSystemEfficiency] = useState<number>(98);
  const [powerInput, setPowerInput] = useState<number>(0);
  const [powerOutput, setPowerOutput] = useState<number>(0);

  // Calculate results
  useEffect(() => {
    let ratio = 1;
    let outSpeed = 0;
    let outTorque = 0;
    let eff = 1.0;
    let inTorque = 0;
    let inSpeed = 0;

    switch (calculationType) {
      case 'simple':
        ratio = drivenTeeth / drivingTeeth;
        outSpeed = inputSpeed / ratio;
        eff = 0.98;
        outTorque = inputTorque * ratio * eff;
        inTorque = inputTorque;
        inSpeed = inputSpeed;
        break;

      case 'compound':
        const stage1Ratio = stage1Driven / stage1Drive;
        const stage2Ratio = stage2Driven / stage2Drive;
        ratio = stage1Ratio * stage2Ratio;
        outSpeed = compoundInputSpeed / ratio;
        eff = 0.96;
        outTorque = compoundInputTorque * ratio * eff;
        inTorque = compoundInputTorque;
        inSpeed = compoundInputSpeed;
        break;

      case 'planetary':
        switch (planetaryConfig) {
          case 'sun_input_ring_fixed':
            ratio = 1 + (ringTeeth / sunTeeth);
            break;
          case 'sun_input_carrier_fixed':
            ratio = -ringTeeth / sunTeeth;
            break;
          case 'carrier_input_ring_fixed':
            ratio = sunTeeth / (sunTeeth + ringTeeth);
            break;
        }
        inSpeed = 1000;
        outSpeed = inSpeed / Math.abs(ratio);
        eff = 0.97;
        inTorque = 10;
        outTorque = inTorque * Math.abs(ratio) * eff;
        break;

      case 'belt':
        ratio = drivenPulleyDiam / drivePulleyDiam;
        eff = efficiency / 100;
        inSpeed = beltInputSpeed;
        outSpeed = beltInputSpeed / ratio;
        inTorque = 10;
        outTorque = inTorque * ratio * eff;
        break;
    }

    const mechAdv = Math.abs(ratio);
    const speedRed = (1 - 1 / Math.abs(ratio)) * 100;
    const torqueMult = outTorque / inTorque;
    const pIn = (inTorque * inSpeed * 2 * Math.PI) / 60; // Power in Watts
    const pOut = (outTorque * outSpeed * 2 * Math.PI) / 60;

    setGearRatio(ratio);
    setMechanicalAdvantage(mechAdv);
    setSpeedReduction(Math.max(0, speedRed));
    setOutputSpeed(outSpeed);
    setOutputTorque(outTorque);
    setTorqueMultiplication(torqueMult);
    setSystemEfficiency(eff * 100);
    setPowerInput(pIn);
    setPowerOutput(pOut);
  }, [
    calculationType,
    drivingTeeth,
    drivenTeeth,
    inputSpeed,
    inputTorque,
    stage1Drive,
    stage1Driven,
    stage2Drive,
    stage2Driven,
    compoundInputSpeed,
    compoundInputTorque,
    sunTeeth,
    planetTeeth,
    ringTeeth,
    planetaryConfig,
    drivePulleyDiam,
    drivenPulleyDiam,
    beltInputSpeed,
    efficiency
  ]);

  // Preset functions
  const setSimpleGears = (driving: number, driven: number) => {
    setDrivingTeeth(driving);
    setDrivenTeeth(driven);
  };

  const setApplication = (appType: string) => {
    switch (appType) {
      case 'automotive':
        setDrivingTeeth(12);
        setDrivenTeeth(39);
        setInputSpeed(3000);
        setInputTorque(200);
        break;
      case 'bicycle':
        setDrivingTeeth(48);
        setDrivenTeeth(16);
        setInputSpeed(80);
        setInputTorque(50);
        break;
      case 'drill':
        setDrivingTeeth(8);
        setDrivenTeeth(72);
        setInputSpeed(18000);
        setInputTorque(2);
        break;
      case 'clockwork':
        setDrivingTeeth(10);
        setDrivenTeeth(120);
        setInputSpeed(1);
        setInputTorque(0.001);
        break;
      case 'conveyor':
        setDrivingTeeth(18);
        setDrivenTeeth(72);
        setInputSpeed(1750);
        setInputTorque(15);
        break;
      case 'winch':
        setDrivingTeeth(10);
        setDrivenTeeth(100);
        setInputSpeed(1200);
        setInputTorque(5);
        break;
    }
    setCalculationType('simple');
  };

  // Schema.org WebApplication markup
  const webAppSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Gear Ratio Calculator",
    "description": "Calculate gear ratios, mechanical advantage, speed reduction, and torque multiplication for simple, compound, planetary, and belt/pulley systems.",
    "url": "https://www.example.com/us/tools/calculators/gear-ratio-calculator",
    "applicationCategory": "Engineering Calculator",
    "operatingSystem": "All",
    "permissions": "none",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <article className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-4 sm:py-6 md:py-8">
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
            {getH1('Gear Ratio Calculator')}
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {getSubHeading('Calculate gear ratios, mechanical advantage, speed reduction, and torque multiplication for various gear systems')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Section */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4 md:space-y-6">
            {/* Calculation Type Selection */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span> Select Gear System Type
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { value: 'simple', label: 'Simple Pair', icon: '🔧', desc: 'Two-gear system' },
                  { value: 'compound', label: 'Compound', icon: '🔩', desc: 'Multi-stage train' },
                  { value: 'planetary', label: 'Planetary', icon: '🌍', desc: 'Epicyclic system' },
                  { value: 'belt', label: 'Belt/Pulley', icon: '⭕', desc: 'Pulley system' },
                ].map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setCalculationType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      calculationType === type.value
                        ? 'border-blue-500 bg-blue-50 shadow-md'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-gray-50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{type.icon}</div>
                    <div className="font-semibold text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500">{type.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Gear Configuration */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                {calculationType === 'simple' && '🔧 Simple Gear Pair Configuration'}
                {calculationType === 'compound' && '🔩 Compound Gear Train Configuration'}
                {calculationType === 'planetary' && '🌍 Planetary Gear System Configuration'}
                {calculationType === 'belt' && '⭕ Belt/Pulley System Configuration'}
              </h3>

              <div className="space-y-3 sm:space-y-4 md:space-y-6">
                {/* Simple Gear Inputs */}
                {calculationType === 'simple' && (
                  <>
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-4 text-blue-800">Gear Specifications</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Driving Gear (Input) Teeth
                          </label>
                          <input
                            type="number"
                            value={drivingTeeth}
                            onChange={(e) => setDrivingTeeth(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Driven Gear (Output) Teeth
                          </label>
                          <input
                            type="number"
                            value={drivenTeeth}
                            onChange={(e) => setDrivenTeeth(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Input Speed (RPM)
                          </label>
                          <input
                            type="number"
                            value={inputSpeed}
                            onChange={(e) => setInputSpeed(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Input Torque (N⋅m)
                          </label>
                          <input
                            type="number"
                            value={inputTorque}
                            onChange={(e) => setInputTorque(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-purple-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-3 text-purple-800">Common Gear Ratios</h4>
                      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
                        {[
                          { label: '2:1', driving: 12, driven: 24 },
                          { label: '3:1', driving: 15, driven: 45 },
                          { label: '4:1', driving: 20, driven: 80 },
                          { label: '5:1', driving: 10, driven: 50 },
                          { label: '10:1', driving: 12, driven: 120 },
                          { label: '1:1', driving: 40, driven: 40 },
                        ].map((preset) => (
                          <button
                            key={preset.label}
                            onClick={() => setSimpleGears(preset.driving, preset.driven)}
                            className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-2 text-sm rounded-lg transition font-medium"
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="bg-orange-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-3 text-orange-800">Real-World Applications</h4>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {[
                          { label: '🚗 Car Differential', value: 'automotive' },
                          { label: '🚴 Bicycle Gearing', value: 'bicycle' },
                          { label: '🔌 Power Drill', value: 'drill' },
                          { label: '⏰ Clock Mechanism', value: 'clockwork' },
                          { label: '📦 Conveyor Belt', value: 'conveyor' },
                          { label: '🏗️ Winch System', value: 'winch' },
                        ].map((app) => (
                          <button
                            key={app.value}
                            onClick={() => setApplication(app.value)}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-2 text-sm rounded-lg transition"
                          >
                            {app.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Compound Gear Inputs */}
                {calculationType === 'compound' && (
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-4 text-green-800">Stage 1 - First Gear Pair</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driving Teeth</label>
                          <input
                            type="number"
                            value={stage1Drive}
                            onChange={(e) => setStage1Drive(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driven Teeth</label>
                          <input
                            type="number"
                            value={stage1Driven}
                            onChange={(e) => setStage1Driven(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-green-700">
                        Stage 1 Ratio: {(stage1Driven / stage1Drive).toFixed(2)}:1
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-4 text-blue-800">Stage 2 - Second Gear Pair</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driving Teeth</label>
                          <input
                            type="number"
                            value={stage2Drive}
                            onChange={(e) => setStage2Drive(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Driven Teeth</label>
                          <input
                            type="number"
                            value={stage2Driven}
                            onChange={(e) => setStage2Driven(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                          />
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-blue-700">
                        Stage 2 Ratio: {(stage2Driven / stage2Drive).toFixed(2)}:1
                      </div>
                    </div>

                    <div className="bg-gray-50 rounded-lg p-5">
                      <h4 className="font-semibold mb-4 text-gray-800">Input Parameters</h4>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Input Speed (RPM)</label>
                          <input
                            type="number"
                            value={compoundInputSpeed}
                            onChange={(e) => setCompoundInputSpeed(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Input Torque (N⋅m)</label>
                          <input
                            type="number"
                            value={compoundInputTorque}
                            onChange={(e) => setCompoundInputTorque(parseFloat(e.target.value) || 0)}
                            min="0"
                            step="0.1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-lg"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Planetary Gear Inputs */}
                {calculationType === 'planetary' && (
                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-5">
                    <h4 className="font-semibold mb-4 text-indigo-800">Planetary Gear Parameters</h4>
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ☀️ Sun Gear Teeth
                          </label>
                          <input
                            type="number"
                            value={sunTeeth}
                            onChange={(e) => setSunTeeth(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            🌍 Planet Gear Teeth
                          </label>
                          <input
                            type="number"
                            value={planetTeeth}
                            onChange={(e) => setPlanetTeeth(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            ⭕ Ring Gear Teeth
                          </label>
                          <input
                            type="number"
                            value={ringTeeth}
                            onChange={(e) => setRingTeeth(parseFloat(e.target.value) || 1)}
                            min="1"
                            step="1"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Configuration</label>
                        <select
                          value={planetaryConfig}
                          onChange={(e) => setPlanetaryConfig(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                        >
                          <option value="sun_input_ring_fixed">Sun Input, Ring Fixed (Speed Reduction)</option>
                          <option value="sun_input_carrier_fixed">Sun Input, Carrier Fixed (Reverse)</option>
                          <option value="carrier_input_ring_fixed">Carrier Input, Ring Fixed (Speed Increase)</option>
                        </select>
                      </div>
                      <div className="bg-indigo-100 rounded-lg p-3 text-sm text-indigo-700">
                        <strong>Note:</strong> For a valid planetary gear set, Ring Teeth = Sun Teeth + 2 × Planet Teeth.
                        <br />
                        Recommended Ring Teeth: {sunTeeth + 2 * planetTeeth}
                      </div>
                    </div>
                  </div>
                )}

                {/* Belt/Pulley Inputs */}
                {calculationType === 'belt' && (
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-lg p-5">
                    <h4 className="font-semibold mb-4 text-amber-800">Belt/Pulley System Parameters</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Drive Pulley Diameter (mm)
                        </label>
                        <input
                          type="number"
                          value={drivePulleyDiam}
                          onChange={(e) => setDrivePulleyDiam(parseFloat(e.target.value) || 1)}
                          min="1"
                          step="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Driven Pulley Diameter (mm)
                        </label>
                        <input
                          type="number"
                          value={drivenPulleyDiam}
                          onChange={(e) => setDrivenPulleyDiam(parseFloat(e.target.value) || 1)}
                          min="1"
                          step="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Input Speed (RPM)
                        </label>
                        <input
                          type="number"
                          value={beltInputSpeed}
                          onChange={(e) => setBeltInputSpeed(parseFloat(e.target.value) || 0)}
                          min="0"
                          step="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          System Efficiency (%)
                        </label>
                        <input
                          type="number"
                          value={efficiency}
                          onChange={(e) => setEfficiency(Math.min(100, Math.max(1, parseFloat(e.target.value) || 95)))}
                          min="1"
                          max="100"
                          step="1"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                        />
                      </div>
                    </div>
                    <div className="mt-4 bg-amber-100 rounded-lg p-3 text-sm text-amber-700">
                      <strong>Typical Belt Efficiencies:</strong> V-Belt: 93-98%, Flat Belt: 95-98%, Timing Belt: 97-99%
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Understanding Gear Ratios */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Understanding Gear Ratios</h3>

              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-800 mb-2">Gear Ratio Fundamentals</h4>
                    <ul className="text-sm text-blue-700 space-y-1">
                      <li>• Ratio = Driven Teeth ÷ Driving Teeth</li>
                      <li>• Formula: GR = N₂/N₁ = D₂/D₁</li>
                      <li>• Output Speed = Input Speed ÷ GR</li>
                      <li>• Output Torque = Input Torque × GR × η</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-green-50 rounded-lg">
                    <h4 className="font-semibold text-green-800 mb-2">Common Applications</h4>
                    <ul className="text-sm text-green-700 space-y-1">
                      <li>• Automotive transmissions & differentials</li>
                      <li>• Industrial machinery & conveyors</li>
                      <li>• Power tools & robotics</li>
                      <li>• Bicycles & motorcycles</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 rounded-lg">
                    <h4 className="font-semibold text-purple-800 mb-2">Gear Types</h4>
                    <ul className="text-sm text-purple-700 space-y-1">
                      <li>• Spur: Parallel shafts, simple</li>
                      <li>• Helical: Quieter, smoother</li>
                      <li>• Bevel: 90° shaft angles</li>
                      <li>• Worm: High ratios, non-reversible</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-orange-50 rounded-lg">
                    <h4 className="font-semibold text-orange-800 mb-2">Design Considerations</h4>
                    <ul className="text-sm text-orange-700 space-y-1">
                      <li>• Material: Steel, brass, plastic, nylon</li>
                      <li>• Lubrication requirements</li>
                      <li>• Load capacity & duty cycle</li>
                      <li>• Backlash & precision needs</li>
                    </ul>
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
          </div>

          {/* Results Sidebar */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            {/* Primary Results */}
            <div className="bg-white rounded-xl shadow-lg p-5 sticky top-4">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>📊</span> Results
              </h3>

              <div className="space-y-4">
                {/* Main Ratio Display */}
                <div className="text-center p-5 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl text-white">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold">
                    {Math.abs(gearRatio).toFixed(2)}:1
                  </div>
                  <div className="text-blue-100 text-sm mt-1">
                    {gearRatio < 0 ? 'Gear Ratio (Reversed)' : 'Gear Ratio'}
                  </div>
                  {gearRatio > 1 ? (
                    <div className="mt-2 text-xs text-blue-200">Speed Reduction / Torque Increase</div>
                  ) : gearRatio < 1 ? (
                    <div className="mt-2 text-xs text-blue-200">Speed Increase / Torque Reduction</div>
                  ) : (
                    <div className="mt-2 text-xs text-blue-200">Direct Drive (1:1)</div>
                  )}
                </div>

                {/* Detailed Results */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-sm text-gray-600">Output Speed</span>
                    <span className="font-bold text-green-700">{Math.round(Math.abs(outputSpeed)).toLocaleString()} RPM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-sm text-gray-600">Output Torque</span>
                    <span className="font-bold text-purple-700">{outputTorque.toFixed(2)} N⋅m</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                    <span className="text-sm text-gray-600">Mechanical Advantage</span>
                    <span className="font-bold text-orange-700">{mechanicalAdvantage.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-gray-600">Speed Reduction</span>
                    <span className="font-bold text-blue-700">{speedReduction.toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                    <span className="text-sm text-gray-600">Torque Multiplication</span>
                    <span className="font-bold text-indigo-700">{torqueMultiplication.toFixed(2)}x</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-sm text-gray-600">System Efficiency</span>
                    <span className="font-bold text-gray-700">{systemEfficiency.toFixed(0)}%</span>
                  </div>
                </div>

                {/* Power Analysis */}
                <div className="border-t pt-4">
                  <h4 className="font-semibold text-gray-700 mb-2">Power Analysis</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Input Power</span>
                      <span className="font-medium">{(powerInput / 1000).toFixed(3)} kW</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Output Power</span>
                      <span className="font-medium">{(powerOutput / 1000).toFixed(3)} kW</span>
                    </div>
                    <div className="flex justify-between text-red-600">
                      <span>Power Loss</span>
                      <span className="font-medium">{((powerInput - powerOutput) / 1000).toFixed(3)} kW</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Gear Ratio Reference */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-blue-800 mb-4">Common Industrial Ratios</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700">1:1</span>
                  <span className="text-blue-600">Direct drive, coupling</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700">2:1 - 5:1</span>
                  <span className="text-blue-600">Light reduction</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700">5:1 - 20:1</span>
                  <span className="text-blue-600">Standard gearbox</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-blue-200">
                  <span className="text-blue-700">20:1 - 100:1</span>
                  <span className="text-blue-600">High reduction</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-blue-700">100:1+</span>
                  <span className="text-blue-600">Worm gear, multi-stage</span>
                </div>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-green-800 mb-3">Quick Tips</h3>
              <div className="space-y-2 text-sm text-green-700">
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Higher ratio = more torque, less speed</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Lower ratio = more speed, less torque</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Power (W) = Torque (N⋅m) × Speed (rad/s)</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Account for 2-5% efficiency loss per stage</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>Use compound trains for ratios over 10:1</span>
                </div>
              </div>
            </div>

            {/* Efficiency Guide */}
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-xl p-5">
              <h3 className="text-lg font-bold text-amber-800 mb-3">Typical Efficiencies</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-amber-700">Spur Gears</span>
                  <span className="font-medium text-amber-800">94-98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Helical Gears</span>
                  <span className="font-medium text-amber-800">94-98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Bevel Gears</span>
                  <span className="font-medium text-amber-800">93-97%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Worm Gears</span>
                  <span className="font-medium text-amber-800">40-90%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Planetary</span>
                  <span className="font-medium text-amber-800">95-98%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Belt/Pulley</span>
                  <span className="font-medium text-amber-800">93-99%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
