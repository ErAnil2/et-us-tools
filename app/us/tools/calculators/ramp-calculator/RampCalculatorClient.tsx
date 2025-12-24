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
}

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

// Slope ratios for different standards
const slopeStandards = {
  ada: 12,        // 1:12 maximum
  commercial: 20,  // 1:20 preferred
  residential: 8,  // 1:8 allowable
  custom: 12      // default, will be overridden
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Ramp Calculator?",
    answer: "A Ramp Calculator is a free online tool designed to help you quickly and accurately calculate ramp-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Ramp Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Ramp Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Ramp Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function RampCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('ramp-calculator');

  const [calcMode, setCalcMode] = useState<'length' | 'rise' | 'slope'>('length');
  const [rise, setRise] = useState<number>(24);
  const [availableLength, setAvailableLength] = useState<number>(0);
  const [slopeRise, setSlopeRise] = useState<number>(0);
  const [slopeRun, setSlopeRun] = useState<number>(0);
  const [standard, setStandard] = useState<'ada' | 'commercial' | 'residential' | 'custom'>('ada');
  const [customSlopeValue, setCustomSlopeValue] = useState<number>(12);
  const [includeLandings, setIncludeLandings] = useState<boolean>(true);

  // Results state
  const [primaryResult, setPrimaryResult] = useState<string>('24 ft');
  const [resultLabel, setResultLabel] = useState<string>('Required Ramp Length');
  const [displayRise, setDisplayRise] = useState<string>('24 inches');
  const [displayRun, setDisplayRun] = useState<string>('24 feet');
  const [displaySlope, setDisplaySlope] = useState<string>('1:12 (8.33%)');
  const [displayAngle, setDisplayAngle] = useState<string>('4.76°');
  const [landingsNeeded, setLandingsNeeded] = useState<number>(0);
  const [totalLength, setTotalLength] = useState<string>('24 ft');
  const [complianceStatus, setComplianceStatus] = useState<{
    className: string;
    content: JSX.Element;
  }>({
    className: 'mt-6 p-4 rounded-lg bg-green-100 border border-green-200',
    content: (
      <>
        <h4 className="font-semibold text-green-800 mb-2">✅ ADA Compliant</h4>
        <div className="text-sm text-green-700">
          This ramp meets ADA accessibility guidelines with a maximum 1:12 slope ratio.
        </div>
      </>
    )
  });

  const calculateRamp = () => {
    let maxSlope = slopeStandards[standard];
    if (standard === 'custom') {
      maxSlope = customSlopeValue || 12;
    }

    let riseValue: number, runValue: number, slopeValue: number, angleValue: number;
    let compliant: boolean;

    switch(calcMode) {
      case 'length':
        riseValue = rise || 0;
        if (riseValue <= 0) {
          resetResults();
          return;
        }

        runValue = (riseValue / 12) * maxSlope; // Convert rise to feet and multiply by slope ratio
        slopeValue = riseValue / (runValue * 12); // Slope as rise over run
        angleValue = Math.atan(slopeValue) * (180 / Math.PI);
        compliant = runValue >= (riseValue / 12) * 12; // Check if meets minimum ADA 1:12

        setPrimaryResult(`${runValue.toFixed(1)} ft`);
        setResultLabel('Required Ramp Length');
        break;

      case 'rise':
        const availableLengthValue = availableLength || 0;
        if (availableLengthValue <= 0) {
          resetResults();
          return;
        }

        riseValue = (availableLengthValue * 12) / maxSlope; // Maximum rise for given length
        runValue = availableLengthValue;
        slopeValue = riseValue / (runValue * 12);
        angleValue = Math.atan(slopeValue) * (180 / Math.PI);
        compliant = true; // By definition, this will be compliant

        setPrimaryResult(`${riseValue.toFixed(1)}"`);
        setResultLabel('Maximum Rise');
        break;

      case 'slope':
        riseValue = slopeRise || 0;
        runValue = slopeRun || 0;
        if (riseValue <= 0 || runValue <= 0) {
          resetResults();
          return;
        }

        slopeValue = riseValue / (runValue * 12);
        angleValue = Math.atan(slopeValue) * (180 / Math.PI);
        const actualSlope = (runValue * 12) / riseValue;
        compliant = actualSlope >= 12; // ADA requires 1:12 minimum

        setPrimaryResult(`${(slopeValue * 100).toFixed(2)}%`);
        setResultLabel('Slope Percentage');
        break;

      default:
        return;
    }

    // Calculate landings needed
    const landingCount = includeLandings ? Math.floor(runValue / 30) : 0;
    const totalLengthWithLandings = runValue + (landingCount * 5); // 5 feet per landing

    // Update displays
    setDisplayRise(`${riseValue.toFixed(1)} inches`);
    setDisplayRun(`${runValue.toFixed(1)} feet`);
    setDisplaySlope(`1:${((runValue * 12) / riseValue).toFixed(0)} (${(slopeValue * 100).toFixed(2)}%)`);
    setDisplayAngle(`${angleValue.toFixed(2)}°`);
    setLandingsNeeded(landingCount);
    setTotalLength(`${totalLengthWithLandings.toFixed(1)} ft`);

    // Update compliance status
    updateComplianceStatus(compliant, slopeValue, maxSlope, standard);
  };

  const updateComplianceStatus = (compliant: boolean, slope: number, maxSlope: number, standardType: string) => {
    const maxSlopePercent = (1 / maxSlope * 100).toFixed(2);

    if (compliant) {
      setComplianceStatus({
        className: 'mt-6 p-4 rounded-lg bg-green-100 border border-green-200',
        content: (
          <>
            <h4 className="font-semibold text-green-800 mb-2">✅ {standardType.toUpperCase()} Compliant</h4>
            <div className="text-sm text-green-700">
              This ramp meets {standardType.toUpperCase()} accessibility guidelines with a maximum 1:{maxSlope} slope ratio.
            </div>
          </>
        )
      });
    } else {
      setComplianceStatus({
        className: 'mt-6 p-4 rounded-lg bg-red-100 border border-red-200',
        content: (
          <>
            <h4 className="font-semibold text-red-800 mb-2">❌ Non-Compliant</h4>
            <div className="text-sm text-red-700">
              This ramp exceeds the {standardType.toUpperCase()} maximum slope of {maxSlopePercent}%. Consider reducing the rise or increasing the run.
            </div>
          </>
        )
      });
    }
  };

  const resetResults = () => {
    setPrimaryResult('0');
    setResultLabel('Result');
    setDisplayRise('0 inches');
    setDisplayRun('0 feet');
    setDisplaySlope('0% (0:0)');
    setDisplayAngle('0°');
    setLandingsNeeded(0);
    setTotalLength('0 ft');

    setComplianceStatus({
      className: 'mt-6 p-4 rounded-lg bg-gray-100',
      content: <div className="text-gray-600">Enter dimensions to check compliance</div>
    });
  };

  // Effect to recalculate when inputs change
  useEffect(() => {
    calculateRamp();
  }, [calcMode, rise, availableLength, slopeRise, slopeRun, standard, customSlopeValue, includeLandings]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Ramp Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate ADA compliant wheelchair ramp dimensions and slope requirements</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Ramp Requirements</h2>

            {/* Calculation Mode */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculate</label>
              <select
                id="calcMode"
                value={calcMode}
                onChange={(e) => setCalcMode(e.target.value as 'length' | 'rise' | 'slope')}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="length">Ramp Length (given rise)</option>
                <option value="rise">Maximum Rise (given length)</option>
                <option value="slope">Slope Percentage</option>
              </select>
            </div>

            {/* Input for Length Calculation */}
            {calcMode === 'length' && (
              <div id="lengthInputs">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rise (vertical height in inches)</label>
                  <input
                    type="number"
                    id="rise"
                    step="0.5"
                    placeholder="e.g., 24"
                    value={rise}
                    onChange={(e) => setRise(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Input for Rise Calculation */}
            {calcMode === 'rise' && (
              <div id="riseInputs">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Available Ramp Length (feet)</label>
                  <input
                    type="number"
                    id="availableLength"
                    step="0.5"
                    placeholder="e.g., 20"
                    value={availableLength || ''}
                    onChange={(e) => setAvailableLength(parseFloat(e.target.value) || 0)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Input for Slope Calculation */}
            {calcMode === 'slope' && (
              <div id="slopeInputs">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Rise (inches)</label>
                    <input
                      type="number"
                      id="slopeRise"
                      step="0.5"
                      placeholder="e.g., 24"
                      value={slopeRise || ''}
                      onChange={(e) => setSlopeRise(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Run (feet)</label>
                    <input
                      type="number"
                      id="slopeRun"
                      step="0.5"
                      placeholder="e.g., 20"
                      value={slopeRun || ''}
                      onChange={(e) => setSlopeRun(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Compliance Standard */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Compliance Standard</label>
              <select
                id="standard"
                value={standard}
                onChange={(e) => setStandard(e.target.value as 'ada' | 'commercial' | 'residential' | 'custom')}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="ada">ADA (1:12 max slope)</option>
                <option value="commercial">Commercial (1:20 preferred)</option>
                <option value="residential">Residential (1:8 allowable)</option>
                <option value="custom">Custom Slope</option>
              </select>
            </div>

            {/* Custom Slope Input */}
            {standard === 'custom' && (
              <div id="customSlope">
                <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Slope (1:X)</label>
                <input
                  type="number"
                  id="customSlopeValue"
                  min="4"
                  max="30"
                  placeholder="e.g., 12"
                  value={customSlopeValue}
                  onChange={(e) => setCustomSlopeValue(parseFloat(e.target.value) || 12)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {/* Landing Requirements */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Landing Requirements</h4>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeLandings"
                    checked={includeLandings}
                    onChange={(e) => setIncludeLandings(e.target.checked)}
                    className="rounded text-blue-600"
                  />
                  <span className="ml-2 text-blue-700">Include landings in calculation</span>
                </label>
                <div className="text-xs text-blue-600">
                  ADA requires 5&apos; landings every 30&apos; of ramp length
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Ramp Specifications</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600" id="primaryResult">{primaryResult}</div>
                <div className="text-green-700" id="resultLabel">{resultLabel}</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Rise:</span>
                  <span id="displayRise" className="font-semibold">{displayRise}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Run:</span>
                  <span id="displayRun" className="font-semibold">{displayRun}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Slope:</span>
                  <span id="displaySlope" className="font-semibold">{displaySlope}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Angle:</span>
                  <span id="displayAngle" className="font-semibold">{displayAngle}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Landings Needed:</span>
                  <span id="landingsNeeded" className="font-semibold">{landingsNeeded}</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Total Length:</span>
                  <span id="totalLength" className="font-semibold text-purple-600">{totalLength}</span>
                </div>
              </div>
            </div>

            {/* Compliance Status */}
            <div className={complianceStatus.className} id="complianceStatus">
              {complianceStatus.content}
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">ADA Ramp Requirements</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Slope Requirements:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>ADA Maximum:</strong> 1:12 (8.33%)</li>
              <li>• <strong>Preferred:</strong> 1:16 to 1:20</li>
              <li>• <strong>Residential:</strong> 1:8 may be acceptable</li>
              <li>• <strong>Cross slope:</strong> Maximum 1:48 (2.08%)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Landing Requirements:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Length:</strong> Minimum 60&quot; (5 feet)</li>
              <li>• <strong>Width:</strong> Same as ramp width</li>
              <li>• <strong>Frequency:</strong> Every 30 feet maximum</li>
              <li>• <strong>Top/Bottom:</strong> Required at all changes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Specifications Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Additional Ramp Specifications</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Width & Clearance</h4>
            <ul className="text-sm space-y-1">
              <li>• Minimum width: 36&quot;</li>
              <li>• Preferred width: 44&quot;</li>
              <li>• Clear width: 32&quot; minimum</li>
              <li>• Headroom: 80&quot; minimum</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Handrails</h4>
            <ul className="text-sm space-y-1">
              <li>• Required if rise &gt; 6&quot;</li>
              <li>• Height: 34&quot; to 38&quot;</li>
              <li>• Extend 12&quot; beyond ramp</li>
              <li>• Both sides required</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Edge Protection</h4>
            <ul className="text-sm space-y-1">
              <li>• 2&quot; minimum curb height</li>
              <li>• Or extended surface</li>
              <li>• Prevents wheel drop-off</li>
              <li>• Required both sides</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mt-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link key={calc.href} href={calc.href} className="group">
              <div className="rounded-lg p-4 bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all h-full">
                <div className="text-2xl mb-2">📊</div>
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="ramp-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
