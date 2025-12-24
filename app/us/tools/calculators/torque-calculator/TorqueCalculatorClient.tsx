'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'What is torque and how is it calculated?',
    answer: 'Torque is a rotational force that causes an object to rotate around an axis. It is calculated using the formula: Torque (τ) = Force (F) × Distance (r) × sin(θ), where θ is the angle between the force and the lever arm. Maximum torque occurs when the force is perpendicular (90°) to the lever arm.',
    order: 1
  },
  {
    id: '2',
    question: 'What is the difference between torque and horsepower?',
    answer: 'Torque is the rotational force that causes movement, measured in Newton-meters (N·m) or pound-feet (lb-ft). Horsepower is the rate at which work is done (power). They are related by: Power = Torque × Angular Velocity. A high-torque engine provides strong acceleration, while high horsepower allows for higher top speeds.',
    order: 2
  },
  {
    id: '3',
    question: 'Why is torque angle important?',
    answer: 'The angle at which force is applied significantly affects the torque produced. At 90° (perpendicular), you get maximum torque. At 0° or 180° (parallel), torque is zero because the force passes through the rotation axis. This is why using the correct wrench angle is crucial when tightening bolts.',
    order: 3
  },
  {
    id: '4',
    question: 'What are common torque specifications for bolts?',
    answer: 'Common torque specs vary by bolt size and grade. For Grade 8.8 bolts: M6 (8-12 N·m), M8 (20-25 N·m), M10 (40-50 N·m), M12 (70-85 N·m). Automotive lug nuts typically require 80-140 N·m depending on the vehicle. Always consult manufacturer specifications for critical applications.',
    order: 4
  },
  {
    id: '5',
    question: 'How does a longer lever arm affect torque?',
    answer: 'A longer lever arm (distance from the rotation axis) increases torque proportionally. If you double the lever arm length, you double the torque with the same applied force. This is the principle behind using extension handles on wrenches for stuck bolts - more leverage means more turning force.',
    order: 5
  },
  {
    id: '6',
    question: 'What is the relationship between torque and RPM?',
    answer: 'Torque and RPM together determine power output: Power (W) = Torque (N·m) × Angular Velocity (rad/s), where Angular Velocity = 2π × RPM / 60. At constant power, increasing RPM decreases torque and vice versa. This relationship is fundamental in engine and motor design.',
    order: 6
  }
];

export default function TorqueCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('torque-calculator');

  const [calculationType, setCalculationType] = useState('torque');

  // Torque calculation inputs
  const [force, setForce] = useState(100);
  const [distance, setDistance] = useState(0.5);
  const [angle, setAngle] = useState(90);

  // Force calculation inputs
  const [torqueValue, setTorqueValue] = useState(50);
  const [distanceForForce, setDistanceForForce] = useState(0.5);

  // Distance calculation inputs
  const [torqueForDistance, setTorqueForDistance] = useState(50);
  const [forceForDistance, setForceForDistance] = useState(100);

  // Power calculation inputs
  const [powerValue, setPowerValue] = useState(10000);
  const [rpm, setRpm] = useState(3000);

  // Results
  const [torque, setTorque] = useState(50.0);
  const [torqueLbFt, setTorqueLbFt] = useState(36.9);
  const [torqueKgM, setTorqueKgM] = useState(5.1);
  const [forceResult, setForceResult] = useState(100.0);
  const [distanceResult, setDistanceResult] = useState(0.500);
  const [primaryResult, setPrimaryResult] = useState('50.0 N·m');
  const [horsepowerDisplay, setHorsepowerDisplay] = useState('13.4 HP');

  useEffect(() => {
    calculateTorque();
  }, [calculationType, force, distance, angle, torqueValue, distanceForForce, torqueForDistance, forceForDistance, powerValue, rpm]);

  const calculateTorque = () => {
    let calculatedTorque = 0;
    let calculatedForce = 0;
    let calculatedDistance = 0;
    let primaryResultText = '';
    let primaryResultUnit = '';

    switch(calculationType) {
      case 'torque':
        const angleRad = angle * Math.PI / 180;
        calculatedTorque = force * distance * Math.sin(angleRad);
        calculatedForce = force;
        calculatedDistance = distance;
        primaryResultText = calculatedTorque.toFixed(1);
        primaryResultUnit = 'N·m';
        break;

      case 'force':
        calculatedTorque = torqueValue;
        calculatedDistance = distanceForForce;
        if (distanceForForce > 0) {
          calculatedForce = torqueValue / distanceForForce;
          primaryResultText = calculatedForce.toFixed(1);
          primaryResultUnit = 'N';
        }
        break;

      case 'distance':
        calculatedTorque = torqueForDistance;
        calculatedForce = forceForDistance;
        if (forceForDistance > 0) {
          calculatedDistance = torqueForDistance / forceForDistance;
          primaryResultText = calculatedDistance.toFixed(3);
          primaryResultUnit = 'm';
        }
        break;

      case 'power':
        if (rpm > 0) {
          const omega = 2 * Math.PI * rpm / 60;
          calculatedTorque = powerValue / omega;
          primaryResultText = calculatedTorque.toFixed(1);
          primaryResultUnit = 'N·m';

          const hp = powerValue / 745.7;
          setHorsepowerDisplay(hp.toFixed(1) + ' HP');

          calculatedForce = calculatedTorque;
          calculatedDistance = 1;
        }
        break;
    }

    const calculatedTorqueLbFt = calculatedTorque * 0.737562;
    const calculatedTorqueKgM = calculatedTorque / 9.80665;

    setTorque(calculatedTorque);
    setTorqueLbFt(calculatedTorqueLbFt);
    setTorqueKgM(calculatedTorqueKgM);
    setForceResult(calculatedForce);
    setDistanceResult(calculatedDistance);
    setPrimaryResult(primaryResultText + ' ' + primaryResultUnit);
  };

  const applyTorquePreset = (type: string) => {
    switch(type) {
      case 'wrench':
        setForce(100);
        setDistance(0.3);
        setAngle(90);
        break;
      case 'wheel':
        setForce(200);
        setDistance(0.5);
        setAngle(90);
        break;
      case 'bolt':
        setForce(150);
        setDistance(0.3);
        setAngle(90);
        break;
    }
  };

  const applyPowerPreset = (type: string) => {
    switch(type) {
      case 'small':
        setPowerValue(5000);
        setRpm(5000);
        break;
      case 'car':
        setPowerValue(75000);
        setRpm(4000);
        break;
      case 'industrial':
        setPowerValue(15000);
        setRpm(1500);
        break;
    }
  };

  const copyResults = () => {
    const results = `Torque Calculator Results

Primary Result: ${primaryResult}

Torque:
- ${torque.toFixed(1)} N·m
- ${torqueLbFt.toFixed(1)} lb·ft
- ${torqueKgM.toFixed(1)} kg·m

Force: ${forceResult.toFixed(1)} N
Distance: ${distanceResult.toFixed(3)} m
    `.trim();

    navigator.clipboard.writeText(results).then(() => {
      alert('Results copied to clipboard!');
    });
  };

  // Schema.org structured data
  const webAppSchema = generateWebAppSchema(
    'Torque Calculator',
    'Calculate torque, force, and distance relationships for mechanical systems and rotational applications',
    'https://example.com/us/tools/calculators/torque-calculator',
    'Utility'
  );

  return (
    <article className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-4 md:py-8">
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
      <header className="text-center mb-6 md:mb-10 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 md:mb-4">
          {getH1('Torque Calculator')}
        </h1>
        <p className="text-sm sm:text-base md:text-lg text-blue-100 max-w-3xl mx-auto">
          {getSubHeading('Calculate torque, force, and distance relationships for mechanical systems and rotational applications')}
        </p>
      </header>

      <div className="mb-6 md:mb-8">
        <h2 className="text-base md:text-lg font-semibold text-gray-700 mb-3 md:mb-4">Select Calculation Type:</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="calculationType"
              value="torque"
              checked={calculationType === 'torque'}
              onChange={(e) => setCalculationType(e.target.value)}
              className="peer sr-only"
            />
            <div className="h-full p-3 md:p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-blue-600 peer-checked:bg-blue-50 peer-checked:shadow-lg transition-all hover:bg-gray-50">
              <div className="text-2xl md:text-3xl mb-2">⚙️</div>
              <div className="text-sm md:text-base font-semibold text-gray-900">Calculate Torque</div>
              <div className="text-xs text-gray-500 mt-1">τ = F × r × sin(θ)</div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="calculationType"
              value="force"
              checked={calculationType === 'force'}
              onChange={(e) => setCalculationType(e.target.value)}
              className="peer sr-only"
            />
            <div className="h-full p-3 md:p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-green-600 peer-checked:bg-green-50 peer-checked:shadow-lg transition-all hover:bg-gray-50">
              <div className="text-2xl md:text-3xl mb-2">💪</div>
              <div className="text-sm md:text-base font-semibold text-gray-900">Calculate Force</div>
              <div className="text-xs text-gray-500 mt-1">F = τ / r</div>
            </div>
          </label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="calculationType"
              value="distance"
              checked={calculationType === 'distance'}
              onChange={(e) => setCalculationType(e.target.value)}
              className="peer sr-only"
            />
            <div className="h-full p-3 md:p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-purple-600 peer-checked:bg-purple-50 peer-checked:shadow-lg transition-all hover:bg-gray-50">
              <div className="text-2xl md:text-3xl mb-2">📏</div>
              <div className="text-sm md:text-base font-semibold text-gray-900">Calculate Distance</div>
              <div className="text-xs text-gray-500 mt-1">r = τ / F</div>
            </div>
</label>

          <label className="cursor-pointer">
            <input
              type="radio"
              name="calculationType"
              value="power"
              checked={calculationType === 'power'}
              onChange={(e) => setCalculationType(e.target.value)}
              className="peer sr-only"
            />
            <div className="h-full p-3 md:p-4 border-2 border-gray-300 rounded-xl text-center peer-checked:border-orange-600 peer-checked:bg-orange-50 peer-checked:shadow-lg transition-all hover:bg-gray-50">
              <div className="text-2xl md:text-3xl mb-2">⚡</div>
              <div className="text-sm md:text-base font-semibold text-gray-900">Power & Torque</div>
              <div className="text-xs text-gray-500 mt-1">P = τ × ω</div>
            </div>
          </label>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {calculationType === 'torque' && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Calculate Torque</h3>

              <div className="mb-4 md:mb-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Quick Presets:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  <button onClick={() => applyTorquePreset('wrench')} className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-200 transition-all">
                    Wrench (100N, 0.3m)
                  </button>
                  <button onClick={() => applyTorquePreset('wheel')} className="px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-green-200 transition-all">
                    Wheel (200N, 0.5m)
                  </button>
                  <button onClick={() => applyTorquePreset('bolt')} className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-purple-200 transition-all">
                    M10 Bolt (45N·m)
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="force" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Applied Force (N)</label>
                  <input
                    type="number"
                    id="force"
                    value={force}
                    onChange={(e) => setForce(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="distance" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Distance from Axis (m)</label>
                  <input
                    type="number"
                    id="distance"
                    value={distance}
                    onChange={(e) => setDistance(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.001"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-4 md:mt-6">
                <label htmlFor="angle" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">
                  Angle of Force: <span className="text-blue-600 font-bold text-sm md:text-base">{angle}°</span>
                </label>
                <input
                  type="range"
                  id="angle"
                  value={angle}
                  onChange={(e) => setAngle(parseFloat(e.target.value))}
                  min="0"
                  max="180"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0°</span>
                  <span>90° (Perpendicular)</span>
                  <span>180°</span>
                </div>
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                <div className="text-xs md:text-sm text-gray-700">
                  <strong>Note:</strong> Maximum torque occurs at 90° (perpendicular). At 0° or 180°, torque is zero.
                </div>
              </div>
            </div>
          )}

          {calculationType === 'force' && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Calculate Required Force</h3>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="torqueValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Torque (N·m)</label>
                  <input
                    type="number"
                    id="torqueValue"
                    value={torqueValue}
                    onChange={(e) => setTorqueValue(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="distanceForForce" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Distance from Axis (m)</label>
                  <input
                    type="number"
                    id="distanceForForce"
                    value={distanceForForce}
                    onChange={(e) => setDistanceForForce(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.001"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {calculationType === 'distance' && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Calculate Required Distance</h3>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="torqueForDistance" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Torque (N·m)</label>
                  <input
                    type="number"
                    id="torqueForDistance"
                    value={torqueForDistance}
                    onChange={(e) => setTorqueForDistance(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="forceForDistance" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Applied Force (N)</label>
                  <input
                    type="number"
                    id="forceForDistance"
                    value={forceForDistance}
                    onChange={(e) => setForceForDistance(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="0.1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {calculationType === 'power' && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4 md:mb-6">Calculate Torque from Power</h3>

              <div className="mb-4 md:mb-6">
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2 md:mb-3">Engine Presets:</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 md:gap-3">
                  <button onClick={() => applyPowerPreset('small')} className="px-3 py-2 bg-orange-100 text-orange-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-orange-200 transition-all">
                    Small Engine
                  </button>
                  <button onClick={() => applyPowerPreset('car')} className="px-3 py-2 bg-red-100 text-red-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-red-200 transition-all">
                    Car Engine
                  </button>
                  <button onClick={() => applyPowerPreset('industrial')} className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-xs md:text-sm font-semibold hover:bg-gray-200 transition-all">
                    Industrial Motor
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <label htmlFor="powerValue" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Power (W)</label>
                  <input
                    type="number"
                    id="powerValue"
                    value={powerValue}
                    onChange={(e) => setPowerValue(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>

                <div>
                  <label htmlFor="rpm" className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Rotational Speed (RPM)</label>
                  <input
                    type="number"
                    id="rpm"
                    value={rpm}
                    onChange={(e) => setRpm(parseFloat(e.target.value) || 0)}
                    min="0"
                    step="1"
                    className="w-full px-3 md:px-2 py-2 md:py-3 border-2 border-gray-300 rounded-lg text-sm md:text-base focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                  />
                </div>
              </div>

              <div className="mt-4 md:mt-6 p-3 md:p-4 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border-2 border-orange-200">
                <div className="text-xs md:text-sm text-gray-700">
                  <strong>Horsepower:</strong> <span className="font-bold text-orange-600">{horsepowerDisplay}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel - NOT sticky */}
        <div className="space-y-4 md:space-y-6">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-xl p-4 md:p-6 text-white">
            <h3 className="text-base md:text-lg font-bold mb-3 md:mb-4 flex items-center gap-2">
              Results
            </h3>

            <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 md:p-4 mb-3 md:mb-4">
              <div className="text-xs md:text-sm opacity-90 mb-1">Primary Result</div>
              <div className="text-2xl md:text-3xl font-bold break-words">{primaryResult}</div>
            </div>

            <div className="space-y-2 md:space-y-3">
              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Torque (N·m)</div>
                <div className="text-lg md:text-xl font-bold">{torque.toFixed(1)}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Torque (lb·ft)</div>
                <div className="text-lg md:text-xl font-bold">{torqueLbFt.toFixed(1)}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Torque (kg·m)</div>
                <div className="text-lg md:text-xl font-bold">{torqueKgM.toFixed(1)}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Force (N)</div>
                <div className="text-lg md:text-xl font-bold">{forceResult.toFixed(1)}</div>
              </div>

              <div className="bg-white/10 rounded-lg p-2 md:p-3">
                <div className="text-xs opacity-80">Distance (m)</div>
                <div className="text-lg md:text-xl font-bold">{distanceResult.toFixed(3)}</div>
              </div>
            </div>

            <button
              onClick={copyResults}
              className="w-full mt-4 md:mt-6 px-3 md:px-2 py-2 md:py-3 bg-white text-blue-600 rounded-lg text-xs md:text-sm font-semibold hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
            >
              Copy Results
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            Torque Fundamentals
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li><strong>Definition:</strong> Rotational force that causes rotation</li>
            <li><strong>Formula:</strong> τ = F × r × sin(θ)</li>
            <li><strong>Units:</strong> Newton-meters (N·m), pound-feet (lb·ft)</li>
            <li><strong>Direction:</strong> Right-hand rule determines direction</li>
            <li><strong>Equilibrium:</strong> Sum of torques = 0 for balance</li>
            <li><strong>Vector Quantity:</strong> Has magnitude and direction</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            Common Applications
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li><strong>Bolt Tightening:</strong> Specified torque values</li>
            <li><strong>Engine Output:</strong> Motor torque curves</li>
            <li><strong>Gear Systems:</strong> Torque multiplication</li>
            <li><strong>Wrenches:</strong> Mechanical advantage</li>
            <li><strong>Fasteners:</strong> Proper clamping force</li>
            <li><strong>Machine Design:</strong> Shaft and coupling sizing</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            Power Relationships
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li><strong>Power Formula:</strong> P = τ × ω</li>
            <li><strong>Angular Velocity:</strong> ω = 2π × RPM / 60</li>
            <li><strong>Linear Velocity:</strong> v = ω × r</li>
            <li><strong>Horsepower:</strong> 1 HP = 745.7 W</li>
            <li><strong>Efficiency:</strong> P_out / P_in × 100%</li>
            <li><strong>Gear Ratio:</strong> Affects torque multiplication</li>
          </ul>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
          <h3 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4 flex items-center gap-2">
            Torque Specifications
          </h3>
          <ul className="space-y-2 text-xs md:text-sm text-gray-700">
            <li><strong>M6 Bolt:</strong> 8-12 N·m (Grade 8.8)</li>
            <li><strong>M8 Bolt:</strong> 20-25 N·m (Grade 8.8)</li>
            <li><strong>M10 Bolt:</strong> 40-50 N·m (Grade 8.8)</li>
            <li><strong>M12 Bolt:</strong> 70-85 N·m (Grade 8.8)</li>
            <li><strong>Lug Nuts:</strong> 80-140 N·m (vehicle specific)</li>
            <li><strong>Spark Plugs:</strong> 20-30 N·m (aluminum heads)</li>
          </ul>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <CalculatorMobileMrec2 />



      

      {/* FAQ Section */}
      <FirebaseFAQs pageId="torque-calculator" fallbackFaqs={fallbackFaqs} className="mb-6 md:mb-8" />
      <div className="mt-8 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Related Calculators</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all">
              <h4 className="font-semibold text-sm text-gray-900 mb-1">{calc.title}</h4>
              <p className="text-xs text-gray-600">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </article>
  );
}
