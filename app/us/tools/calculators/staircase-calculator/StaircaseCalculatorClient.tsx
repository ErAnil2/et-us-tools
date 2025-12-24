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

interface ComplianceResult {
  compliant: boolean;
  issues: string[];
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Staircase Calculator?",
    answer: "A Staircase Calculator is a free online tool designed to help you quickly and accurately calculate staircase-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Staircase Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Staircase Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Staircase Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function StaircaseCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('staircase-calculator');

  const [totalRise, setTotalRise] = useState<number>(108);
  const [totalRun, setTotalRun] = useState<number>(0);
  const [riserPreference, setRiserPreference] = useState<string>('7.5');
  const [treadDepth, setTreadDepth] = useState<string>('auto');
  const [stairType, setStairType] = useState<string>('straight');
  const [includeNosing, setIncludeNosing] = useState<boolean>(true);

  // Results state
  const [numberOfSteps, setNumberOfSteps] = useState<number>(15);
  const [riserHeight, setRiserHeight] = useState<string>('7.2');
  const [actualTreadDepth, setActualTreadDepth] = useState<string>('11.0');
  const [calculatedRun, setCalculatedRun] = useState<string>('154.0');
  const [slopeAngle, setSlopeAngle] = useState<string>('33.2');
  const [codeCompliance, setCodeCompliance] = useState<ComplianceResult>({ compliant: true, issues: [] });

  const checkCodeCompliance = (riser: number, tread: number, steps: number): ComplianceResult => {
    const issues: string[] = [];
    let compliant = true;

    if (riser < 4) {
      issues.push('Riser too low');
      compliant = false;
    }
    if (riser > 8.25) {
      issues.push('Riser too high');
      compliant = false;
    }
    if (tread < 10) {
      issues.push('Tread too shallow');
      compliant = false;
    }

    // Check comfort rules
    const comfortRule = 2 * riser + tread;
    if (comfortRule < 24 || comfortRule > 26) {
      issues.push('Comfort rule violation');
    }

    const safetyRule = riser + tread;
    if (safetyRule < 17 || safetyRule > 18) {
      issues.push('Safety rule concern');
    }

    return { compliant, issues };
  };

  const calculateStairs = () => {
    if (totalRise <= 0) {
      resetResults();
      return;
    }

    let optimalRiserHeight: number, calcNumberOfSteps: number, calcActualTreadDepth: number, actualTotalRun: number;

    // Calculate optimal riser height and number of steps
    if (riserPreference === 'auto') {
      // Find optimal riser height between 6.5" and 8"
      let bestRiser = 7.5;
      let bestSteps = Math.round(totalRise / bestRiser);

      for (let testRiser = 6.5; testRiser <= 8; testRiser += 0.1) {
        const steps = Math.round(totalRise / testRiser);
        const actualRiser = totalRise / steps;

        if (actualRiser >= 6.5 && actualRiser <= 8.25 &&
            Math.abs(actualRiser - 7.5) < Math.abs(bestRiser - 7.5)) {
          bestRiser = actualRiser;
          bestSteps = steps;
        }
      }

      optimalRiserHeight = bestRiser;
      calcNumberOfSteps = bestSteps;
    } else {
      const preferredRiser = parseFloat(riserPreference);
      calcNumberOfSteps = Math.round(totalRise / preferredRiser);
      optimalRiserHeight = totalRise / calcNumberOfSteps;
    }

    // Calculate tread depth
    if (treadDepth === 'auto') {
      // Use comfort rule: 2 × Rise + Run = 24-25"
      calcActualTreadDepth = 25 - (2 * optimalRiserHeight);

      // Ensure minimum code requirements
      if (calcActualTreadDepth < 10) calcActualTreadDepth = 10;
      if (calcActualTreadDepth > 13) calcActualTreadDepth = 13;
    } else {
      calcActualTreadDepth = parseFloat(treadDepth);
    }

    // Calculate total run (number of treads = number of steps - 1)
    const numberOfTreads = calcNumberOfSteps - 1;
    actualTotalRun = numberOfTreads * calcActualTreadDepth;

    // If total run was specified, adjust tread depth
    if (totalRun > 0) {
      calcActualTreadDepth = totalRun / numberOfTreads;
      actualTotalRun = totalRun;
    }

    // Calculate slope angle
    const calcSlopeAngle = Math.atan(optimalRiserHeight / calcActualTreadDepth) * (180 / Math.PI);

    // Check code compliance
    const compliance = checkCodeCompliance(optimalRiserHeight, calcActualTreadDepth, calcNumberOfSteps);

    // Update state
    setNumberOfSteps(calcNumberOfSteps);
    setRiserHeight(optimalRiserHeight.toFixed(2));
    setActualTreadDepth(calcActualTreadDepth.toFixed(1));
    setCalculatedRun(actualTotalRun.toFixed(1));
    setSlopeAngle(calcSlopeAngle.toFixed(1));
    setCodeCompliance(compliance);
  };

  const resetResults = () => {
    setNumberOfSteps(0);
    setRiserHeight('0');
    setActualTreadDepth('0');
    setCalculatedRun('0');
    setSlopeAngle('0');
    setCodeCompliance({ compliant: false, issues: ['Enter dimensions'] });
  };

  useEffect(() => {
    calculateStairs();
  }, [totalRise, totalRun, riserPreference, treadDepth, stairType, includeNosing]);

  const drawStairDiagram = () => {
    if (numberOfSteps === 0) {
      return (
        <div className="flex items-center justify-center h-full text-gray-400">
          Enter dimensions to see stair profile
        </div>
      );
    }

    const riser = parseFloat(riserHeight);
    const tread = parseFloat(actualTreadDepth);
    const steps = numberOfSteps;

    const maxWidth = 400;
    const maxHeight = 180;

    // Scale factors
    const scaleX = maxWidth / ((steps - 1) * tread);
    const scaleY = maxHeight / (steps * riser);

    // Create steps path
    const stepsElements = [];
    for (let i = 0; i < steps; i++) {
      const x = i * tread * scaleX;
      const y = maxHeight - ((i + 1) * riser * scaleY);

      // Tread (horizontal line)
      if (i < steps - 1) {
        stepsElements.push(
          <line
            key={`tread-${i}`}
            x1={x}
            y1={y}
            x2={x + tread * scaleX}
            y2={y}
            stroke="#3B82F6"
            strokeWidth="2"
          />
        );
      }

      // Riser (vertical line)
      stepsElements.push(
        <line
          key={`riser-${i}`}
          x1={x + (i < steps - 1 ? tread * scaleX : 0)}
          y1={y}
          x2={x + (i < steps - 1 ? tread * scaleX : 0)}
          y2={y + riser * scaleY}
          stroke="#3B82F6"
          strokeWidth="2"
        />
      );
    }

    return (
      <svg width="100%" height="100%" viewBox={`0 0 ${maxWidth} ${maxHeight}`}>
        {stepsElements}
        <text x="10" y={maxHeight - (riser * scaleY) / 2} fill="#6B7280" fontSize="12">
          {riser.toFixed(1)}"
        </text>
        <text x={(tread * scaleX) / 2} y={maxHeight - 5} fill="#6B7280" fontSize="12" textAnchor="middle">
          {tread.toFixed(1)}"
        </text>
      </svg>
    );
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Staircase Calculator')}</h1>
        <p className="text-lg text-gray-600">Calculate optimal step dimensions, riser height, and tread depth for safe stair construction</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Staircase Specifications</h2>

            {/* Total Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Rise (Height) - inches</label>
              <input
                type="number"
                id="totalRise"
                step="0.25"
                placeholder="e.g., 108"
                value={totalRise}
                onChange={(e) => setTotalRise(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Floor-to-floor height in inches</p>
            </div>

            {/* Total Run */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Total Run (Length) - inches</label>
              <input
                type="number"
                id="totalRun"
                step="0.25"
                placeholder="e.g., 120 (optional)"
                value={totalRun || ''}
                onChange={(e) => setTotalRun(parseFloat(e.target.value) || 0)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Available horizontal space (optional - will calculate optimal)</p>
            </div>

            {/* Preferred Riser Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Riser Height - inches</label>
              <select
                id="riserPreference"
                value={riserPreference}
                onChange={(e) => setRiserPreference(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="auto">Auto-Calculate Optimal</option>
                <option value="6.5">6.5" - Shallow/Comfortable</option>
                <option value="7">7" - Standard Residential</option>
                <option value="7.5">7.5" - Common Standard</option>
                <option value="8">8" - Maximum Comfortable</option>
                <option value="8.25">8.25" - Code Maximum</option>
              </select>
            </div>

            {/* Tread Depth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tread Depth - inches</label>
              <select
                id="treadDepth"
                value={treadDepth}
                onChange={(e) => setTreadDepth(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="auto">Auto-Calculate Optimal</option>
                <option value="9">9" - Minimum Code</option>
                <option value="10">10" - Standard</option>
                <option value="11">11" - Comfortable</option>
                <option value="12">12" - Generous</option>
                <option value="13">13" - Extra Deep</option>
              </select>
            </div>

            {/* Stair Type */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Stair Type & Options</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-blue-700 mb-1">Stair Type</label>
                  <select
                    id="stairType"
                    value={stairType}
                    onChange={(e) => setStairType(e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="straight">Straight Staircase</option>
                    <option value="landing">With Landing</option>
                    <option value="l-shaped">L-Shaped</option>
                    <option value="u-shaped">U-Shaped</option>
                  </select>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="includeNosing"
                    checked={includeNosing}
                    onChange={(e) => setIncludeNosing(e.target.checked)}
                    className="mr-2"
                  />
                  <label htmlFor="includeNosing" className="text-xs text-blue-700">Include Nosing (1" overhang)</label>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Staircase Calculations</h3>

            <div className="space-y-4">
              <div className="bg-green-100 rounded-lg p-4 text-center">
                <div className="text-2xl font-bold text-green-600" id="numberOfSteps">{numberOfSteps}</div>
                <div className="text-green-700">Number of Steps</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Riser Height:</span>
                  <span id="riserHeight" className="font-semibold text-blue-600">{riserHeight}"</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Tread Depth:</span>
                  <span id="actualTreadDepth" className="font-semibold">{actualTreadDepth}"</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Total Run:</span>
                  <span id="calculatedRun" className="font-semibold">{calculatedRun}"</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Slope Angle:</span>
                  <span id="slopeAngle" className="font-semibold">{slopeAngle}°</span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Code Compliance:</span>
                  <span
                    id="codeCompliance"
                    className={`font-semibold ${codeCompliance.compliant ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {codeCompliance.compliant ? '✓ Compliant' : `⚠ Issues: ${codeCompliance.issues.join(', ')}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Stair Diagram */}
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h4 className="font-semibold text-gray-800 mb-2">Stair Profile</h4>
              <div id="stairDiagram" className="w-full h-48 flex items-end justify-start overflow-hidden">
                {drawStairDiagram()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Stair Building Guidelines</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Building Code Requirements:</h4>
            <ul className="space-y-1">
              <li>• <strong>Riser Height:</strong> 4" minimum, 7.75" maximum</li>
              <li>• <strong>Tread Depth:</strong> 10" minimum (11" preferred)</li>
              <li>• <strong>Consistency:</strong> Riser variance ≤ 3/8"</li>
              <li>• <strong>Headroom:</strong> 6'8" minimum clearance</li>
              <li>• <strong>Width:</strong> 36" minimum (44" preferred)</li>
              <li>• <strong>Handrails:</strong> Required for 4+ risers</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Comfort & Safety Rules:</h4>
            <ul className="space-y-1">
              <li>• <strong>2 × Rise + Run = 24-25"</strong> (comfort rule)</li>
              <li>• <strong>Rise + Run = 17-18"</strong> (safety rule)</li>
              <li>• <strong>Nosing:</strong> 0.75"-1.25" overhang</li>
              <li>• <strong>Landing:</strong> Equal to stair width</li>
              <li>• <strong>Winders:</strong> 10" minimum at narrow end</li>
              <li>• <strong>Spiral:</strong> 7.5" minimum tread at 12" from center</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Tips Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Stair Construction Tips</h3>
        <div className="grid md:grid-cols-3 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Planning Phase</h4>
            <ul className="text-sm space-y-1">
              <li>• Check local building codes</li>
              <li>• Get permits if required</li>
              <li>• Measure twice, cut once</li>
              <li>• Plan for handrail mounting</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Construction Tips</h4>
            <ul className="text-sm space-y-1">
              <li>• Use a story pole for consistency</li>
              <li>• Cut stringers with circular saw</li>
              <li>• Test fit before final installation</li>
              <li>• Use construction adhesive + screws</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Finishing Touches</h4>
            <ul className="text-sm space-y-1">
              <li>• Sand all surfaces smooth</li>
              <li>• Prime and paint/stain</li>
              <li>• Install proper lighting</li>
              <li>• Add non-slip treads if needed</li>
            </ul>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
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
        <FirebaseFAQs pageId="staircase-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
