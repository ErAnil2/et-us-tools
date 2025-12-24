'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is body surface area (BSA) and why is it important?",
    answer: "Body Surface Area (BSA) is the total external surface area of the human body, measured in square meters (m²). It's crucial in medicine for calculating appropriate medication dosages (especially chemotherapy and immunosuppressants), determining cardiac index, assessing burn severity, calculating fluid requirements, and determining renal function. BSA provides a more accurate basis for dosing than weight alone because it better correlates with metabolic mass and physiological parameters.",
    order: 1
  },
  {
    id: '2',
    question: "Which BSA formula is most accurate?",
    answer: "The Du Bois formula is the most widely used and considered the standard in clinical practice, validated across diverse populations. The Mosteller formula is simpler to calculate and nearly as accurate, preferred in emergency settings. The Haycock formula is most accurate for children and infants. The Gehan-George formula is specifically designed for cancer patients. In general, all formulas produce results within 5% of each other for most adults, so the Du Bois or Mosteller formulas are recommended for general use.",
    order: 2
  },
  {
    id: '3',
    question: "What is a normal body surface area range?",
    answer: "For adults, normal BSA typically ranges from 1.5 to 2.2 m². Average adult males have approximately 1.9 m² BSA, while average adult females have about 1.6 m². Taller or larger individuals will have higher BSA values, while shorter or smaller individuals will have lower values. Children's BSA varies significantly by age, ranging from about 0.25 m² for newborns to approaching adult values by late adolescence. BSA increases with both height and weight.",
    order: 3
  },
  {
    id: '4',
    question: "How is BSA used in chemotherapy dosing?",
    answer: "Chemotherapy drugs are commonly dosed based on BSA (mg/m²) rather than weight alone because BSA better correlates with metabolic rate, blood volume, and organ function. This approach helps minimize toxicity while maximizing effectiveness. For example, if a drug dose is 100 mg/m² and your BSA is 1.8 m², you would receive 180 mg. BSA-based dosing reduces the risk of under-dosing (reducing efficacy) or over-dosing (increasing toxicity), though some modern protocols are moving toward individualized dosing based on pharmacokinetics.",
    order: 4
  },
  {
    id: '5',
    question: "Can BSA change over time?",
    answer: "Yes, BSA changes with fluctuations in height and weight. For children, BSA increases steadily as they grow. For adults, significant weight gain or loss will alter BSA - gaining 10 kg typically increases BSA by approximately 0.1 m². Height changes are minimal in adults, so weight is the primary variable. BSA should be recalculated periodically during treatment, especially with chemotherapy or when significant weight changes occur. Pregnant women experience BSA increases due to weight gain and physiological changes.",
    order: 5
  },
  {
    id: '6',
    question: "What's the difference between BSA and BMI?",
    answer: "BSA (Body Surface Area) and BMI (Body Mass Index) serve different purposes. BSA measures total external body surface in square meters and is used for medical dosing calculations, fluid requirements, and metabolic assessments. BMI uses height and weight to categorize body weight status (underweight, normal, overweight, obese) and assesses health risks related to weight. BSA increases with both height and weight, while BMI can stay the same if height and weight increase proportionally. You cannot determine health status from BSA alone, unlike BMI.",
    order: 6
  }
];
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
}

interface BodySurfaceAreaClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

export default function BodySurfaceAreaClient({ relatedCalculators = defaultRelatedCalculators }: BodySurfaceAreaClientProps) {
  const { getH1, getSubHeading } = usePageSEO('body-surface-area-calculator');

  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [heightUnit, setHeightUnit] = useState('cm');
  const [weightUnit, setWeightUnit] = useState('kg');

  const [dubois, setDubois] = useState(0);
  const [mosteller, setMosteller] = useState(0);
  const [haycock, setHaycock] = useState(0);
  const [gehanGeorge, setGehanGeorge] = useState(0);

  useEffect(() => {
    calculateBSA();
  }, [height, weight, heightUnit, weightUnit]);

  const calculateBSA = () => {
    // Convert to cm and kg
    let h = height;
    let w = weight;

    if (heightUnit === 'in') h = height * 2.54;
    if (heightUnit === 'ft') h = height * 30.48;
    if (weightUnit === 'lb') w = weight * 0.453592;

    // Du Bois formula: BSA = 0.007184 × height^0.725 × weight^0.425
    const db = 0.007184 * Math.pow(h, 0.725) * Math.pow(w, 0.425);

    // Mosteller formula: BSA = sqrt((height × weight) / 3600)
    const mo = Math.sqrt((h * w) / 3600);

    // Haycock formula: BSA = 0.024265 × height^0.3964 × weight^0.5378
    const hc = 0.024265 * Math.pow(h, 0.3964) * Math.pow(w, 0.5378);

    // Gehan-George formula: BSA = 0.0235 × height^0.42246 × weight^0.51456
    const gg = 0.0235 * Math.pow(h, 0.42246) * Math.pow(w, 0.51456);

    setDubois(db);
    setMosteller(mo);
    setHaycock(hc);
    setGehanGeorge(gg);
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">
          Home
        </Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Body Surface Area Calculator</span>
      </div>

      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2 md:mb-4">{getH1('Body Surface Area Calculator')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Calculate BSA using height and weight with medical formulas
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Measurements</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Height</label>
              <div className="flex">
                <input
                  type="number"
                  value={height}
                  onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={heightUnit}
                  onChange={(e) => setHeightUnit(e.target.value)}
                  className="px-2 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50"
                >
                  <option value="cm">cm</option>
                  <option value="in">inches</option>
                  <option value="ft">feet</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  step="0.1"
                  className="flex-1 px-2 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value)}
                  className="px-2 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50"
                >
                  <option value="kg">kg</option>
                  <option value="lb">pounds</option>
                </select>
              </div>
            </div>

            <div className="bg-yellow-50 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">⚕️ Medical Note</h4>
              <p className="text-yellow-700 text-sm">
                BSA is used in medical settings for drug dosing, chemotherapy calculations, and cardiac index measurements.
                Always consult with healthcare professionals for medical decisions.
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">BSA Results</h3>

            <div className="space-y-4">
              <div className="bg-blue-100 rounded-lg p-4">
                <div className="text-sm text-blue-700">Du Bois Formula</div>
                <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600">{dubois.toFixed(3)} m²</div>
                <div className="text-xs text-blue-600 mt-1">Most widely used</div>
              </div>

              <div className="bg-green-100 rounded-lg p-4">
                <div className="text-sm text-green-700">Mosteller Formula</div>
                <div className="text-2xl font-bold text-green-600">{mosteller.toFixed(3)} m²</div>
                <div className="text-xs text-green-600 mt-1">Easiest to calculate</div>
              </div>

              <div className="bg-purple-100 rounded-lg p-4">
                <div className="text-sm text-purple-700">Haycock Formula</div>
                <div className="text-2xl font-bold text-purple-600">{haycock.toFixed(3)} m²</div>
                <div className="text-xs text-purple-600 mt-1">Accurate for children</div>
              </div>

              <div className="bg-orange-100 rounded-lg p-4">
                <div className="text-sm text-orange-700">Gehan-George Formula</div>
                <div className="text-2xl font-bold text-orange-600">{gehanGeorge.toFixed(3)} m²</div>
                <div className="text-xs text-orange-600 mt-1">Used for cancer patients</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Health Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="group">
              <div className="p-4 rounded-lg border border-gray-200 hover:border-blue-500 hover:shadow-md transition-all">
                <h3 className="text-sm font-semibold text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                  {calc.title}
                </h3>
                <p className="text-xs text-gray-600">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Understanding Body Surface Area (BSA): Medical Applications & Calculations</h2>
        <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
          Body Surface Area (BSA) is a critical measurement in medical practice that represents the total external surface area of the human body in square meters (m²). Unlike simple weight or BMI measurements, BSA accounts for both height and weight, providing a more accurate representation of metabolic mass. This makes it invaluable for precise medication dosing, especially in chemotherapy, immunosuppressants, and other potent drugs where accuracy can mean the difference between therapeutic success and dangerous toxicity. BSA is also essential for assessing cardiac function, burn severity, fluid requirements, and renal clearance.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
            <h3 className="font-semibold text-blue-800 mb-2 text-sm">What is BSA?</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Total external body surface</li>
              <li>• Measured in square meters (m²)</li>
              <li>• Based on height and weight</li>
              <li>• Adults: typically 1.5-2.2 m²</li>
              <li>• More accurate than weight alone</li>
            </ul>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2 text-sm">Medical Applications</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Chemotherapy drug dosing</li>
              <li>• Cardiac index calculations</li>
              <li>• Burn severity assessment</li>
              <li>• Renal function measurements</li>
              <li>• Fluid replacement therapy</li>
            </ul>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
            <h3 className="font-semibold text-purple-800 mb-2 text-sm">Common Formulas</h3>
            <ul className="text-xs text-gray-600 space-y-1">
              <li>• Du Bois - most widely used</li>
              <li>• Mosteller - easiest to calculate</li>
              <li>• Haycock - best for children</li>
              <li>• Gehan-George - for cancer patients</li>
              <li>• Results within 5% of each other</li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">BSA Calculation Formulas Explained</h3>
        <div className="space-y-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">Du Bois Formula (1916) - Gold Standard</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> BSA (m²) = 0.007184 × Height(cm)^0.725 × Weight(kg)^0.425
            </p>
            <p className="text-xs text-gray-600">
              Most widely used in clinical practice. Validated across diverse populations and age groups. Considered the reference standard for BSA calculations. Used in most chemotherapy protocols and clinical research studies.
            </p>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2">Mosteller Formula (1987) - Simplest</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> BSA (m²) = √[(Height(cm) × Weight(kg)) / 3600]
            </p>
            <p className="text-xs text-gray-600">
              Easiest to calculate mentally or with basic calculators. Nearly as accurate as Du Bois for most patients. Preferred in emergency settings when speed matters. Recommended by many medical organizations for general use.
            </p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2">Haycock Formula (1978) - For Children</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> BSA (m²) = 0.024265 × Height(cm)^0.3964 × Weight(kg)^0.5378
            </p>
            <p className="text-xs text-gray-600">
              Most accurate for pediatric patients and infants. Accounts for the different body proportions in children. Widely used in pediatric oncology and intensive care. Recommended for patients under 18 years old.
            </p>
          </div>

          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2">Gehan-George Formula (1970) - For Cancer Patients</h4>
            <p className="text-sm text-gray-600 mb-2">
              <strong>Formula:</strong> BSA (m²) = 0.0235 × Height(cm)^0.42246 × Weight(kg)^0.51456
            </p>
            <p className="text-xs text-gray-600">
              Developed specifically for cancer chemotherapy dosing. More accurate for very obese or very thin patients. Used in many oncology protocols. Accounts for extreme body compositions common in cancer patients.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Clinical Applications of BSA</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Chemotherapy Dosing:</strong> Most cancer drugs dosed in mg/m² to balance efficacy and toxicity across different body sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Cardiac Index:</strong> Cardiac output divided by BSA gives cardiac index, normalizing heart function across body sizes</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Burn Assessment:</strong> Rule of Nines uses BSA percentages to calculate burn severity and fluid needs</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Renal Function:</strong> Glomerular filtration rate (GFR) normalized to 1.73 m² BSA for standardized kidney function</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Immunosuppressants:</strong> Drugs like cyclosporine and tacrolimus often dosed using BSA calculations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500 mt-0.5">•</span>
                <span><strong>Fluid Requirements:</strong> Daily fluid needs calculated as 1500-2000 mL/m² for maintenance therapy</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Normal BSA Reference Ranges</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Adult Males:</strong> Average 1.9 m² (range 1.7-2.1 m² for average builds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Adult Females:</strong> Average 1.6 m² (range 1.4-1.8 m² for average builds)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Newborns:</strong> Approximately 0.25 m² at birth</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Children (5 years):</strong> Approximately 0.7-0.8 m²</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Adolescents (12 years):</strong> Approximately 1.3-1.5 m²</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Very Tall/Large Adults:</strong> Can exceed 2.2 m²</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">•</span>
                <span><strong>Very Short/Small Adults:</strong> May be below 1.5 m²</span>
              </li>
            </ul>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Factors Affecting BSA Accuracy</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Obesity & Body Composition</h4>
            <p className="text-xs text-gray-600">Standard BSA formulas may overestimate surface area in very obese patients because fat tissue has lower surface-to-mass ratio. Some clinicians use adjusted body weight or cap BSA at 2.0 m² for chemotherapy to avoid overdosing.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Measurement Accuracy</h4>
            <p className="text-xs text-gray-600">Accurate height and weight measurements are critical. A 5 kg weight error can change BSA by approximately 0.05 m², which can significantly affect medication dosing. Always use calibrated scales and stadiometers in clinical settings.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Age & Development</h4>
            <p className="text-xs text-gray-600">Children have different body proportions than adults, with relatively larger heads and shorter limbs. Pediatric formulas like Haycock account for these differences. BSA changes rapidly in growing children and should be recalculated frequently.</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <h4 className="font-semibold text-yellow-800 mb-2 text-sm">Formula Selection</h4>
            <p className="text-xs text-gray-600">While all formulas give similar results for average adults, they can differ by 10-15% for very small children or very large adults. Choose the formula appropriate for your patient population - Haycock for children, Du Bois for most adults.</p>
          </div>
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2 text-sm">Fluid Status</h4>
            <p className="text-xs text-gray-600">Severe dehydration or fluid overload (edema, ascites) can artificially decrease or increase weight, affecting BSA calculations. In these cases, use dry weight or pre-illness weight for more accurate BSA calculation.</p>
          </div>
          <div className="bg-pink-50 rounded-lg p-4">
            <h4 className="font-semibold text-pink-800 mb-2 text-sm">Amputations & Deformities</h4>
            <p className="text-xs text-gray-600">Standard formulas assume normal body proportions. Patients with amputations, severe scoliosis, or other skeletal deformities may have BSA that differs from calculated values. Clinical judgment and adjusted calculations may be needed.</p>
          </div>
        </div>

        <h3 className="text-lg font-semibold text-gray-900 mb-3">Important Considerations for BSA Use</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Medical Supervision Required</h4>
            <p className="text-xs text-gray-600">BSA calculations are tools to assist healthcare providers, not replace clinical judgment. All medication dosing decisions should be made by qualified healthcare professionals considering individual patient factors, organ function, and treatment protocols.</p>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Recalculate Regularly</h4>
            <p className="text-xs text-gray-600">BSA should be recalculated whenever significant weight changes occur (generally ≥5 kg in adults or ≥10% in children), before each chemotherapy cycle, and periodically during long-term treatment. Growing children require frequent reassessment.</p>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Not a Health Indicator</h4>
            <p className="text-xs text-gray-600">Unlike BMI, BSA does not indicate health status, obesity, or fitness level. Two people with identical BSA can have vastly different body compositions and health profiles. BSA is purely a calculation tool for medical dosing and physiological normalization.</p>
          </div>
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-lg p-4 border border-orange-100">
            <h4 className="font-semibold text-orange-800 mb-2 text-sm">Evolving Dosing Strategies</h4>
            <p className="text-xs text-gray-600">While BSA-based dosing remains standard, research suggests individualized dosing based on pharmacokinetics, organ function, and genetic factors may be more effective for some drugs. Modern oncology is moving toward precision medicine approaches that complement BSA calculations.</p>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQs Section */}
      <div className="mb-3 sm:mb-4 md:mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="body-surface-area-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
