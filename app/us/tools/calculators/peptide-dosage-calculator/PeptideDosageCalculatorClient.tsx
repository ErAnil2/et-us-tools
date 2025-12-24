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
    question: "What is a Peptide Dosage Calculator?",
    answer: "A Peptide Dosage Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How accurate is the date calculation?",
    answer: "Our calculator accounts for leap years, varying month lengths, and other calendar complexities to provide accurate results. It uses the Gregorian calendar system.",
    order: 2
  },
  {
    id: '3',
    question: "What date formats are supported?",
    answer: "The calculator accepts common date formats and displays results in an easy-to-understand format. Simply enter dates in the format shown in the input fields.",
    order: 3
  },
  {
    id: '4',
    question: "Can I calculate dates far in the future or past?",
    answer: "Yes, the calculator can handle dates spanning many years. It's useful for planning, historical research, or any date-related calculations you need.",
    order: 4
  },
  {
    id: '5',
    question: "Is timezone considered in calculations?",
    answer: "Date calculations are based on calendar dates. For time-specific calculations, ensure you're considering your local timezone for the most accurate results.",
    order: 5
  }
];

export default function PeptideDosageCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  const { getH1, getSubHeading } = usePageSEO('peptide-dosage-calculator');

  const [peptideAmount, setPeptideAmount] = useState(10);
  const [peptideUnit, setPeptideUnit] = useState('mg');
  const [reconstitutionVolume, setReconstitutionVolume] = useState(2);
  const [volumeUnit, setVolumeUnit] = useState('ml');
  const [desiredDose, setDesiredDose] = useState(250);
  const [doseUnit, setDoseUnit] = useState('mcg');

  const [concentration, setConcentration] = useState('5.0 mg/ml');
  const [volumeToInject, setVolumeToInject] = useState('0.05 ml');
  const [volumeInUnits, setVolumeInUnits] = useState('(5 units on 100-unit syringe)');
  const [totalDoses, setTotalDoses] = useState('40 doses');
  const [volumeMl, setVolumeMl] = useState('0.05 ml');
  const [volumeCc, setVolumeCc] = useState('0.05 cc');
  const [insulinUnits, setInsulinUnits] = useState('5 units');
  const [tuberculinMark, setTuberculinMark] = useState('0.05 ml mark');

  useEffect(() => {
    calculateDosage();
  }, [peptideAmount, peptideUnit, reconstitutionVolume, volumeUnit, desiredDose, doseUnit]);

  const formatNumber = (num: number, decimals: number = 2): string => {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    }).format(num);
  };

  const convertToMcg = (amount: number, unit: string): number => {
    switch(unit) {
      case 'mg': return amount * 1000;
      case 'mcg': return amount;
      case 'iu': return amount * 3.7; // Rough conversion, varies by peptide
      default: return amount;
    }
  };

  const calculateDosage = () => {
    // Convert everything to mcg for calculations
    const peptideAmountMcg = convertToMcg(peptideAmount, peptideUnit);
    const desiredDoseMcg = convertToMcg(desiredDose, doseUnit);

    // Convert volume to ml if needed
    const volumeMl = volumeUnit === 'cc' ? reconstitutionVolume : reconstitutionVolume;

    // Calculate concentration in mcg/ml
    const concentrationMcgPerMl = peptideAmountMcg / volumeMl;

    // Calculate volume to inject in ml
    const volumeToInjectMl = desiredDoseMcg / concentrationMcgPerMl;

    // Calculate total doses available
    const totalDosesCount = Math.floor(volumeMl / volumeToInjectMl);

    // Display concentration in appropriate units
    let concentrationDisplay;
    if (concentrationMcgPerMl >= 1000) {
      concentrationDisplay = `${formatNumber(concentrationMcgPerMl / 1000)} mg/ml`;
    } else {
      concentrationDisplay = `${formatNumber(concentrationMcgPerMl)} mcg/ml`;
    }

    // Update results
    setConcentration(concentrationDisplay);
    setVolumeToInject(`${formatNumber(volumeToInjectMl, 3)} ml`);
    setTotalDoses(`${totalDosesCount} doses`);

    // Volume conversions
    setVolumeMl(`${formatNumber(volumeToInjectMl, 3)} ml`);
    setVolumeCc(`${formatNumber(volumeToInjectMl, 3)} cc`);

    // Insulin syringe units (100 units = 1 ml)
    const insulinUnitsValue = volumeToInjectMl * 100;
    setInsulinUnits(`${formatNumber(insulinUnitsValue, 1)} units`);
    setVolumeInUnits(`(${formatNumber(insulinUnitsValue, 1)} units on 100-unit syringe)`);

    setTuberculinMark(`${formatNumber(volumeToInjectMl, 3)} ml mark`);
  };

  const applyPeptidePreset = (amount: number, unit: string, volume: number, dose: number, doseUnitValue: string) => {
    setPeptideAmount(amount);
    setPeptideUnit(unit);
    setReconstitutionVolume(volume);
    setDesiredDose(dose);
    setDoseUnit(doseUnitValue);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-3 sm:mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600">Peptide Dosage Calculator</span>
      </div>

      {/* Important Disclaimer */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-3 sm:mb-4 md:mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">Research Use Only</h3>
            <div className="mt-2 text-sm text-red-700">
              <p>This calculator is for research and educational purposes only. Not intended for human consumption or medical use. Always consult qualified professionals for research protocols.</p>
            </div>
          </div>
        </div>
      </div>

      <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8">{getH1('Peptide Dosage Calculator')}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-5 md:gap-8 mb-12">
        {/* Calculator Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 md:p-6">
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Peptide Information */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Peptide Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="peptideAmount" className="block text-sm font-medium text-gray-700 mb-2">Peptide Amount</label>
                    <div className="flex">
                      <input
                        type="number"
                        id="peptideAmount"
                        className="flex-1 px-2 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={peptideAmount}
                        onChange={(e) => setPeptideAmount(parseFloat(e.target.value) || 0)}
                        min="0.1"
                        step="0.1"
                      />
                      <select
                        id="peptideUnit"
                        className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                        value={peptideUnit}
                        onChange={(e) => setPeptideUnit(e.target.value)}
                      >
                        <option value="mg">mg</option>
                        <option value="mcg">mcg (μg)</option>
                        <option value="iu">IU</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reconstitutionVolume" className="block text-sm font-medium text-gray-700 mb-2">Reconstitution Volume</label>
                    <div className="flex">
                      <input
                        type="number"
                        id="reconstitutionVolume"
                        className="flex-1 px-2 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        value={reconstitutionVolume}
                        onChange={(e) => setReconstitutionVolume(parseFloat(e.target.value) || 0)}
                        min="0.1"
                        step="0.1"
                      />
                      <select
                        id="volumeUnit"
                        className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                        value={volumeUnit}
                        onChange={(e) => setVolumeUnit(e.target.value)}
                      >
                        <option value="ml">ml</option>
                        <option value="cc">cc</option>
                      </select>
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Volume of bacteriostatic water added</p>
                  </div>
                </div>
              </div>

              {/* Desired Dose */}
              <div className="border-b pb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Desired Dose</h3>

                <div>
                  <label htmlFor="desiredDose" className="block text-sm font-medium text-gray-700 mb-2">Target Dose</label>
                  <div className="flex">
                    <input
                      type="number"
                      id="desiredDose"
                      className="flex-1 px-2 py-2.5 rounded-l-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                      value={desiredDose}
                      onChange={(e) => setDesiredDose(parseFloat(e.target.value) || 0)}
                      min="0.1"
                      step="0.1"
                    />
                    <select
                      id="doseUnit"
                      className="px-3 py-2.5 rounded-r-lg border border-l-0 border-gray-300 bg-gray-50 text-gray-700"
                      value={doseUnit}
                      onChange={(e) => setDoseUnit(e.target.value)}
                    >
                      <option value="mcg">mcg (μg)</option>
                      <option value="mg">mg</option>
                      <option value="iu">IU</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Common Peptide Presets */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Common Research Peptides</h3>
                <p className="text-sm text-gray-600 mb-4">Click to populate typical values (research purposes only):</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  <button
                    type="button"
                    className="px-2 py-3 text-sm border rounded-lg hover:bg-indigo-50 text-left"
                    onClick={() => applyPeptidePreset(10, 'mg', 2, 250, 'mcg')}
                  >
                    <div className="font-semibold">TB-500 (10mg)</div>
                    <div className="text-xs text-gray-500">Typical: 250mcg dose</div>
                  </button>

                  <button
                    type="button"
                    className="px-2 py-3 text-sm border rounded-lg hover:bg-indigo-50 text-left"
                    onClick={() => applyPeptidePreset(5, 'mg', 2, 100, 'mcg')}
                  >
                    <div className="font-semibold">BPC-157 (5mg)</div>
                    <div className="text-xs text-gray-500">Typical: 100-200mcg dose</div>
                  </button>

                  <button
                    type="button"
                    className="px-2 py-3 text-sm border rounded-lg hover:bg-indigo-50 text-left"
                    onClick={() => applyPeptidePreset(2, 'mg', 2, 100, 'mcg')}
                  >
                    <div className="font-semibold">GHRP-6 (2mg)</div>
                    <div className="text-xs text-gray-500">Typical: 100mcg dose</div>
                  </button>

                  <button
                    type="button"
                    className="px-2 py-3 text-sm border rounded-lg hover:bg-indigo-50 text-left"
                    onClick={() => applyPeptidePreset(2, 'mg', 2, 300, 'mcg')}
                  >
                    <div className="font-semibold">Ipamorelin (2mg)</div>
                    <div className="text-xs text-gray-500">Typical: 200-300mcg dose</div>
                  </button>
                </div>
              </div>

              {/* Formula Display */}
              <div className="p-4 bg-indigo-50 rounded-lg">
                <div className="text-sm font-medium text-gray-700 mb-2">Calculation Formula:</div>
                <div className="space-y-1 font-mono text-sm text-gray-600">
                  <div>Concentration = Peptide Amount ÷ Reconstitution Volume</div>
                  <div>Volume to Inject = Desired Dose ÷ Concentration</div>
                </div>
              </div>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        </div>

        {/* Results Panel */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-indigo-50 to-purple-100 rounded-xl p-3 sm:p-4 md:p-6 sticky top-4">
            <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Dosage Results</h2>

            <div className="space-y-4">
              {/* Concentration */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Final Concentration</div>
                <div className="text-2xl font-bold text-indigo-600">{concentration}</div>
              </div>

              {/* Volume to Inject */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Volume to Inject</div>
                <div className="text-xl font-semibold text-gray-800">{volumeToInject}</div>
                <div className="text-xs text-gray-500">{volumeInUnits}</div>
              </div>
{/* Doses Available */}
              <div className="bg-white rounded-lg p-4">
                <div className="text-sm text-gray-600">Total Doses Available</div>
                <div className="text-lg font-semibold text-gray-800">{totalDoses}</div>
              </div>

              {/* Measurement Conversions */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Volume Conversions</h3>

                <div className="space-y-2">
                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Milliliters (ml)</div>
                    <div className="font-semibold text-sm">{volumeMl}</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Cubic Centimeters (cc)</div>
                    <div className="font-semibold text-sm">{volumeCc}</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Insulin Syringe (100 units)</div>
                    <div className="font-semibold text-sm">{insulinUnits}</div>
                  </div>

                  <div className="bg-white rounded-lg p-3">
                    <div className="text-xs text-gray-600">Tuberculin Syringe</div>
                    <div className="font-semibold text-sm">{tuberculinMark}</div>
                  </div>
                </div>
              </div>

              {/* Storage Information */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Storage Guidelines</h3>

                <div className="space-y-2 text-xs text-gray-600">
                  <div className="bg-white rounded-lg p-2">
                    <div className="font-semibold">Unreconstituted:</div>
                    <div>Store at 2-8°C (fridge)</div>
                  </div>

                  <div className="bg-white rounded-lg p-2">
                    <div className="font-semibold">Reconstituted:</div>
                    <div>Use within 28 days, store at 2-8°C</div>
                  </div>

                  <div className="bg-white rounded-lg p-2">
                    <div className="font-semibold">Reconstitution:</div>
                    <div>Use bacteriostatic water for multi-use</div>
                  </div>
                </div>
              </div>

              {/* Safety Notice */}
              <div className="bg-yellow-100 rounded-lg p-3">
                <div className="text-xs text-yellow-800">
                  <strong>Research Only:</strong> This calculator is for laboratory research purposes only. Not for human consumption.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Peptide Dosage Calculations</h2>
        <div className="prose max-w-none text-gray-700">
          <p>
            Peptide dosage calculations are essential for research applications involving reconstituted peptides. Understanding concentration ratios, reconstitution volumes, and proper measurement techniques ensures accurate research protocols. This calculator helps researchers determine the correct volumes for their intended peptide concentrations in laboratory settings.
          </p>
        </div>
      </div>

      {/* Critical Medical Disclaimer */}
      <div className="mt-12 bg-red-50 border-2 border-red-500 rounded-xl p-3 sm:p-4 md:p-6">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-800 mb-3">CRITICAL MEDICAL WARNING</h3>
            <div className="text-sm text-red-800 space-y-2">
              <p><strong>DO NOT USE THIS CALCULATOR FOR ACTUAL MEDICAL DOSING.</strong></p>
              <p><strong>This calculator is for educational and research purposes only.</strong> Peptide dosing is highly individualized and must be determined by qualified healthcare professionals.</p>
              <p><strong>NEVER self-administer peptides without proper medical supervision:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Peptides are investigational compounds with unknown long-term effects</li>
                <li>Improper dosing can cause serious adverse reactions</li>
                <li>Individual response varies significantly based on health status</li>
                <li>Drug interactions and contraindications must be evaluated</li>
                <li>Proper sterile technique and storage are critical</li>
              </ul>
              <p><strong>Legal and safety considerations:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Peptides may not be approved for human use in your jurisdiction</li>
                <li>Quality and purity of research compounds cannot be guaranteed</li>
                <li>Seek products only from licensed medical providers</li>
              </ul>
              <p className="text-red-900 font-bold">ALWAYS consult with a qualified physician, endocrinologist, or peptide therapy specialist before considering any peptide protocol. This tool does not replace professional medical consultation.</p>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link
              key={index}
              href={calc.href}
              className="block p-3 sm:p-4 md:p-6 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
            >
              <div className={`w-12 h-12 ${calc.color || 'bg-gray-500'} rounded-lg flex items-center justify-center mb-4`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
              <p className="text-gray-600 text-sm">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="peptide-dosage-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
