'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
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

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Mg To Ml Calculator?",
    answer: "A Mg To Ml Calculator is a free online tool designed to help you quickly and accurately calculate mg to ml-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Mg To Ml Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Mg To Ml Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Mg To Ml Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function MgToMlClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('mg-to-ml-calculator');

  const [dosage, setDosage] = useState<string>('250');
  const [concentration, setConcentration] = useState<string>('50');
  const [totalMg, setTotalMg] = useState<string>('');
  const [totalMl, setTotalMl] = useState<string>('');
  const [resultsHTML, setResultsHTML] = useState<string>('<div class="text-center text-gray-500 text-sm p-8">Enter dosage and concentration to see results</div>');

  const setConcentrationPreset = (value: number) => {
    setConcentration(value.toString());
  };

  const calculateConcentration = () => {
    const totalMgVal = parseFloat(totalMg);
    const totalMlVal = parseFloat(totalMl);

    if (isNaN(totalMgVal) || isNaN(totalMlVal) || totalMlVal === 0) {
      alert('Please enter valid values for both total mg and total mL');
      return;
    }

    const concentrationVal = totalMgVal / totalMlVal;
    setConcentration(concentrationVal.toFixed(2));

    // Show calculation in results
    const html = `
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 class="font-semibold text-blue-900 mb-2">Concentration Calculated</h4>
        <div class="text-blue-800">
          <div class="text-lg font-bold">${concentrationVal.toFixed(2)} mg/mL</div>
          <div class="text-sm mt-2">
            Calculation: ${totalMgVal} mg ÷ ${totalMlVal} mL = ${concentrationVal.toFixed(2)} mg/mL
          </div>
        </div>
      </div>
    `;
    setResultsHTML(html);

    // Auto-calculate dosage if dosage value is present
    if (dosage) {
      calculateDosage();
    }
  };

  const calculateDosage = () => {
    const dosageVal = parseFloat(dosage);
    const concentrationVal = parseFloat(concentration);

    if (isNaN(dosageVal) || isNaN(concentrationVal)) {
      setResultsHTML('<div class="text-center text-gray-500">Enter dosage and concentration to see results</div>');
      return;
    }

    if (concentrationVal === 0) {
      setResultsHTML('<div class="text-center text-red-500">Concentration cannot be zero</div>');
      return;
    }

    const volume = dosageVal / concentrationVal;

    // Determine appropriate precision based on volume
    let precision = 2;
    if (volume >= 10) precision = 1;
    if (volume >= 100) precision = 0;

    // Common measurement equivalents
    let measurementTips = '';
    if (volume <= 0.1) {
      measurementTips = '<div class="text-sm text-orange-600 mt-2">⚠️ Very small volume - use precision syringe</div>';
    } else if (volume <= 1) {
      measurementTips = '<div class="text-sm text-blue-600 mt-2">💡 Use 1 mL syringe for accuracy</div>';
    } else if (volume === 2.5) {
      measurementTips = '<div class="text-sm text-green-600 mt-2">💡 Equivalent to 1/2 teaspoon</div>';
    } else if (volume === 5) {
      measurementTips = '<div class="text-sm text-green-600 mt-2">💡 Equivalent to 1 teaspoon</div>';
    } else if (volume === 15) {
      measurementTips = '<div class="text-sm text-green-600 mt-2">💡 Equivalent to 1 tablespoon</div>';
    } else if (volume > 30) {
      measurementTips = '<div class="text-sm text-yellow-600 mt-2">⚠️ Large volume - verify dosage is correct</div>';
    }

    // Safety check for unusually high or low volumes
    let safetyWarning = '';
    if (volume < 0.05) {
      safetyWarning = '<div class="bg-red-100 border border-red-300 rounded p-2 mt-3"><div class="text-red-800 text-sm font-semibold">⚠️ CAUTION: Extremely small volume - verify calculation</div></div>';
    } else if (volume > 50) {
      safetyWarning = '<div class="bg-yellow-100 border border-yellow-300 rounded p-2 mt-3"><div class="text-yellow-800 text-sm font-semibold">⚠️ LARGE VOLUME: Double-check dosage and concentration</div></div>';
    }

    const html = `
      <div class="space-y-4">
        <!-- Main Result -->
        <div class="bg-white border-2 border-blue-200 rounded-lg p-4">
          <div class="text-center">
            <div class="text-4xl font-bold text-blue-600 mb-2">
              ${volume.toFixed(precision)} mL
            </div>
            <div class="text-sm text-gray-600">Volume needed</div>
            ${measurementTips}
          </div>
        </div>

        <!-- Calculation Details -->
        <div class="bg-gray-50 rounded-lg p-4">
          <h4 class="font-semibold text-gray-900 mb-2">Calculation Details</h4>
          <div class="space-y-2 text-sm">
            <div class="font-mono bg-white p-2 rounded border">
              ${dosageVal} mg ÷ ${concentrationVal} mg/mL = ${volume.toFixed(precision)} mL
            </div>
            <div class="text-gray-600">
              <div><strong>Required dose:</strong> ${dosageVal} mg</div>
              <div><strong>Concentration:</strong> ${concentrationVal} mg/mL</div>
              <div><strong>Volume to administer:</strong> ${volume.toFixed(precision)} mL</div>
            </div>
          </div>
        </div>

        <!-- Verification -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 class="font-semibold text-green-900 mb-2">✓ Verification</h4>
          <div class="text-sm text-green-800">
            ${volume.toFixed(precision)} mL × ${concentrationVal} mg/mL = ${(volume * concentrationVal).toFixed(1)} mg
            <div class="mt-1 font-semibold">
              ${Math.abs((volume * concentrationVal) - dosageVal) < 0.1 ? 'Calculation verified ✓' : 'Please check calculation'}
            </div>
          </div>
        </div>

        ${safetyWarning}
      </div>
    `;
    setResultsHTML(html);
  };

  useEffect(() => {
    if (dosage && concentration) {
      calculateDosage();
    }
  }, [dosage, concentration]);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      {/* Header */}
      <header className="text-center mb-6 md:mb-10">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 md:mb-4">{getH1('mg to mL Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600 max-w-3xl mx-auto mb-3 md:mb-4">
          Convert milligrams (mg) to milliliters (mL) for medications, solutions, and liquid measurements. Includes dosage calculations and concentration conversions.
        </p>
        <div className="max-w-3xl mx-auto p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-xs md:text-sm text-yellow-800">
          ⚠️ <strong>Medical Disclaimer:</strong> This calculator is for educational purposes only. Always consult healthcare professionals for medical dosages.
        </div>
      </header>

      {/* Main Grid Layout: Calculator (2/3) + Results Sidebar (1/3) */}
      <div className="grid lg:grid-cols-3 gap-6 md:gap-8 mb-6 md:mb-8">
        {/* Left Column: Calculator (2/3) */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Calculator Card */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 md:mb-6">Convert mg to mL</h2>

            <div className="space-y-4">
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700 mb-2">
                  Dosage Amount (mg)
                </label>
                <input
                  type="number"
                  id="dosage"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter dosage in mg"
                  step="0.1"
                />
              </div>

              <div>
                <label htmlFor="concentration" className="block text-sm font-medium text-gray-700 mb-2">
                  Concentration (mg/mL)
                </label>
                <input
                  type="number"
                  id="concentration"
                  value={concentration}
                  onChange={(e) => setConcentration(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter concentration"
                  step="0.1"
                />
                {/* Quick Concentration Buttons */}
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-3 mt-2">
                  <label className="block text-xs font-medium text-blue-800 mb-2">Common Concentrations:</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => setConcentrationPreset(100)}
                      className="px-3 py-2 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 text-xs font-medium transition-colors border border-blue-200"
                    >
                      100 mg/mL
                    </button>
                    <button
                      onClick={() => setConcentrationPreset(250)}
                      className="px-3 py-2 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 text-xs font-medium transition-colors border border-green-200"
                    >
                      250 mg/mL
                    </button>
                    <button
                      onClick={() => setConcentrationPreset(500)}
                      className="px-3 py-2 bg-orange-100 text-orange-800 rounded-lg hover:bg-orange-200 text-xs font-medium transition-colors border border-orange-200"
                    >
                      500 mg/mL
                    </button>
                  </div>
                </div>
              </div>

              <button
                onClick={calculateDosage}
                className="w-full bg-blue-600 text-white py-2.5 md:py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors font-semibold"
              >
                Calculate mL Needed
              </button>

              {/* Alternative Input Method */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3 text-sm md:text-base">Alternative: Calculate from Solution</h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label htmlFor="totalMg" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Total mg in solution
                    </label>
                    <input
                      type="number"
                      id="totalMg"
                      value={totalMg}
                      onChange={(e) => setTotalMg(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="Total mg"
                      step="0.1"
                    />
                  </div>
                  <div>
                    <label htmlFor="totalMl" className="block text-xs md:text-sm font-medium text-gray-700 mb-1">
                      Total mL in solution
                    </label>
                    <input
                      type="number"
                      id="totalMl"
                      value={totalMl}
                      onChange={(e) => setTotalMl(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                      placeholder="Total mL"
                      step="0.1"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateConcentration}
                  className="w-full mt-3 bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors text-sm font-medium"
                >
                  Calculate Concentration
                </button>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Right Column: Results Sidebar (1/3) */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 lg:sticky lg:top-6">
            <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Results</h2>
            <div dangerouslySetInnerHTML={{ __html: resultsHTML }} />
          </div>
        </div>
      </div>

      {/* Information Cards - 3 columns */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Card 1: Pain Relief */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-red-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Pain Relief</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <div>Ibuprofen: 100 mg/5 mL (20 mg/mL)</div>
                <div>Acetaminophen: 160 mg/5 mL (32 mg/mL)</div>
                <div>Morphine: 10-20 mg/mL</div>
              </div>
            </div>
          </div>
        </div>
{/* Card 2: Antibiotics */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-blue-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Antibiotics</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <div>Amoxicillin: 250 mg/5 mL (50 mg/mL)</div>
                <div>Cephalexin: 250 mg/5 mL (50 mg/mL)</div>
                <div>Azithromycin: 200 mg/5 mL (40 mg/mL)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Other Common */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-green-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Other Common</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <div>Prednisone: 15 mg/5 mL (3 mg/mL)</div>
                <div>Diphenhydramine: 12.5 mg/5 mL (2.5 mg/mL)</div>
                <div>Albuterol: 2 mg/5 mL (0.4 mg/mL)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Formula */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-purple-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Basic Formula</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-2">
                <div className="bg-purple-50 p-2 rounded font-mono text-xs">mL = mg ÷ (mg/mL)</div>
                <p className="text-xs">Calculates volume needed based on dosage and concentration.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Card 5: Safety Tips */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-yellow-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Safety Tips</h3>
              <ul className="text-sm text-gray-600 leading-relaxed space-y-1">
                <li>• Double-check all calculations</li>
                <li>• Use oral syringes for accuracy</li>
                <li>• Never exceed prescribed dosages</li>
                <li>• Consult healthcare professionals</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card 6: Measurement Tips */}
        <div className="bg-white rounded-xl shadow-lg p-5 md:p-6">
          <div className="flex items-start gap-3 mb-3">
            <div className="bg-amber-100 rounded-lg p-2">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Conversions</h3>
              <div className="text-sm text-gray-600 leading-relaxed space-y-1">
                <div>• 1 teaspoon = 5 mL</div>
                <div>• 1 tablespoon = 15 mL</div>
                <div>• Pediatric doses often in 5 mL</div>
                <div>• Injectables highly concentrated</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Converter Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className={`${calc.color || 'bg-gray-500'} rounded-lg p-6 text-white hover:opacity-90 transition-opacity`}>
                <h3 className="text-lg font-bold mb-2">{calc.title}</h3>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="mg-to-ml-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
