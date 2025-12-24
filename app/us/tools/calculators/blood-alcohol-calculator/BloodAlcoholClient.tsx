'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
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

interface BloodAlcoholClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

type Gender = 'male' | 'female';
type WeightUnit = 'lbs' | 'kg';

// Widmark formula constants
const MALE_R = 0.68; // Body water constant for males
const FEMALE_R = 0.55; // Body water constant for females
const ALCOHOL_ELIMINATION_RATE = 0.015; // BAC decrease per hour

const bacEffects = [
  { range: '0.00-0.02%', status: 'Safe to Drive', effects: 'No obvious effects, slight mood elevation', color: 'bg-green-50' },
  { range: '0.03-0.05%', status: 'Impaired (some states)', effects: 'Relaxation, slight impairment of reasoning', color: 'bg-yellow-50' },
  { range: '0.06-0.07%', status: 'Impaired', effects: 'Lowered inhibitions, impaired judgment', color: 'bg-orange-50' },
  { range: '0.08-0.10%', status: 'Legally Intoxicated', effects: 'Poor coordination, speech, vision, reaction time', color: 'bg-red-50' },
  { range: '0.11-0.15%', status: 'Severely Impaired', effects: 'Vomiting, loss of balance, mental confusion', color: 'bg-red-100' },
  { range: '0.16%+', status: 'Dangerous', effects: 'Blackouts, loss of consciousness, death risk', color: 'bg-red-200' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is blood alcohol content (BAC) and how is it measured?",
    answer: "Blood Alcohol Content (BAC) is the concentration of alcohol in your bloodstream, expressed as a percentage representing grams of alcohol per 100 milliliters of blood. A BAC of 0.08% means there are 0.08 grams of alcohol per 100ml of blood (or 80mg per 100ml). BAC is measured through several methods: breath analysis using breathalyzers (measures alcohol in exhaled air, converted to blood concentration via a 2100:1 ratio—2100 parts breath air contains the same alcohol as 1 part blood), blood tests providing direct measurement (the gold standard for legal proceedings, though requiring medical personnel and laboratory analysis), urine tests (less accurate, measuring alcohol metabolites that remain after alcohol leaves bloodstream), and saliva tests (emerging technology, less invasive than blood draws). This calculator uses the Widmark formula—the most widely accepted equation for estimating BAC: BAC = (Alcohol consumed in grams / (Body weight in grams × r)) - (β × time in hours), where 'r' is the gender-specific body water constant (0.68 for males, 0.55 for females reflecting body composition differences) and 'β' is the alcohol elimination rate (typically 0.015% per hour, though varying 0.010-0.020% individually).",
    order: 1
  },
  {
    id: '2',
    question: "Why do men and women process alcohol differently?",
    answer: "Gender significantly affects alcohol metabolism due to physiological differences in body composition, enzyme activity, and hormones. The primary factors are: Body water percentage—men average 60-68% total body water while women average 52-55%. Since alcohol distributes throughout body water (not fat tissue), women achieve higher BAC concentrations from equivalent alcohol doses in lower total body weight. This explains the different Widmark constants (r=0.68 males, r=0.55 females). Body fat percentage—women typically carry 8-10% more body fat than men of equivalent weight. Fat tissue contains minimal water, so alcohol concentrates in the smaller water compartment, elevating BAC. Alcohol dehydrogenase enzyme—the primary enzyme that metabolizes alcohol in the stomach (first-pass metabolism) is 40-60% less active in women than men, meaning more alcohol enters the bloodstream unmetabolized in women. Hormonal fluctuations—the menstrual cycle affects alcohol metabolism, with slower elimination during premenstrual phases (high progesterone) and faster clearance during menstruation. Oral contraceptives can also slow alcohol metabolism. Body size differences—men typically weigh more than women, providing greater volume for alcohol distribution. Combined, these factors mean a 140-lb woman drinking the same amount as a 180-lb man could experience 25-35% higher peak BAC levels, even before considering the enzyme differences.",
    order: 2
  },
  {
    id: '3',
    question: "How fast does the body eliminate alcohol?",
    answer: "The human body metabolizes alcohol at a relatively constant rate of approximately 0.015% BAC per hour (the standard used in this calculator), though individual rates range from 0.010-0.020% per hour based on genetics, liver health, and metabolic factors. This metabolism occurs primarily through three pathways: Alcohol Dehydrogenase (ADH)—the primary metabolic pathway occurring in the liver, converting ethanol to acetaldehyde at a fixed rate (about one standard drink per hour for average adults). This rate-limiting step cannot be accelerated through coffee, cold showers, exercise, or other interventions. Cytochrome P450 2E1 (CYP2E1)—a secondary pathway that activates with chronic heavy drinking, metabolizing about 10% of alcohol in social drinkers but increasing to 20-25% in chronic users. This enzyme also produces more toxic byproducts and free radicals, contributing to alcohol-related liver damage. Catalase enzyme—responsible for eliminating less than 2% of consumed alcohol, occurring throughout the body but concentrated in liver peroxisomes. Critical factors affecting elimination rate: chronic alcohol use can increase clearance rate through enzyme upregulation (tolerance), liver disease dramatically slows metabolism as functional hepatocytes decrease, genetics determine enzyme production (some Asian populations have inactive aldehyde dehydrogenase variants causing acetaldehyde accumulation and facial flushing), body size correlates with liver size and metabolic capacity, and age-related decline in liver mass and function reduces elimination rates in elderly individuals. No method exists to accelerate alcohol elimination—time is the only solution.",
    order: 3
  },
  {
    id: '4',
    question: "What factors can make BAC calculators inaccurate?",
    answer: "While the Widmark formula provides scientifically-validated estimates, numerous variables can cause 20-50% deviation from calculated BAC values. Major sources of inaccuracy include: Food consumption—eating before or during drinking slows gastric emptying and alcohol absorption, reducing peak BAC by 20-40% compared to fasting. High-protein and high-fat meals are most effective at slowing absorption. Carbonated alcoholic beverages accelerate absorption through faster gastric emptying and increased stomach surface area exposure, potentially increasing BAC by 20-30% versus non-carbonated drinks. Drinking rate and pattern—rapid consumption (shots, chugging) produces higher peak BAC than the same amount consumed slowly, as absorption outpaces elimination. The body begins metabolizing alcohol immediately, so spacing drinks allows continuous elimination. Hydration status—dehydration concentrates alcohol in smaller fluid volume, increasing BAC measurements. Chronic dehydration also impairs liver function. Medications and drugs—over 150 medications interact with alcohol, including antibiotics (metronidazole), antihistamines, antidepressants, diabetes medications, and pain relievers. These can either accelerate or inhibit metabolism. Liver health—fatty liver disease (affecting 25% of US adults), hepatitis, cirrhosis, and other conditions reduce metabolic capacity, slowing elimination and increasing BAC duration. Individual metabolism—genetic variations in ADH and ALDH enzymes cause 2-3x differences in alcohol processing rates between individuals. Age-related changes—adults over 65 show 20-30% slower alcohol metabolism due to decreased liver mass, reduced blood flow, and lower enzyme activity. Body composition—muscular individuals have higher body water percentages than calculated constants suggest, potentially lowering actual BAC below estimates.",
    order: 4
  },
  {
    id: '5',
    question: "What are the legal BAC limits and consequences of exceeding them?",
    answer: "BAC legal limits vary by jurisdiction, driver category, and circumstances, with severe consequences for violations. United States standards: Standard drivers (21+): 0.08% BAC is the legal limit in all 50 states per the National Minimum Drinking Age Act. However, impairment begins well below this threshold—reaction time and judgment decline at 0.02-0.04% BAC. Commercial drivers: 0.04% BAC federal limit applies to CDL holders operating commercial vehicles, with many companies enforcing zero-tolerance policies. Under-21 drivers: Zero-tolerance laws set limits at 0.00-0.02% (depending on state) for drivers under the legal drinking age, recognizing any alcohol consumption is illegal. Enhanced penalties: Utah enacted 0.05% BAC limit in 2018, with studies suggesting other states may follow as research demonstrates significant impairment at levels below 0.08%. Legal consequences of DUI/DWI (varying by state and circumstances): First offense—$500-10,000 fines, 48 hours to 1 year jail time, 90-day to 1-year license suspension, mandatory alcohol education programs, ignition interlock device requirements (24+ states), SR-22 insurance (high-risk) requirements, and criminal record. Subsequent offenses—escalating penalties including mandatory minimum jail sentences (often 10 days to 5 years), multi-year license revocations, vehicle impoundment or forfeiture, felony charges (typically third offense or if injury/death occurred). Aggravating factors—BAC ≥0.15-0.20% triggers 'extreme DUI' enhanced penalties, child passengers under 14 result in child endangerment charges, causing injury/death can result in vehicular manslaughter/homicide felony charges with 5-15+ year prison sentences. Beyond legal penalties: insurance rates increase 80-300% for 3-7 years, professional licenses (medical, legal, commercial driving) face suspension/revocation, employment consequences including termination and difficulty securing future positions, and immigration implications for non-citizens including deportation risk.",
    order: 5
  },
  {
    id: '6',
    question: "At what BAC level does alcohol become medically dangerous or fatal?",
    answer: "While legal intoxication begins at 0.08% BAC, medical dangers escalate substantially at higher concentrations, with potentially fatal consequences above 0.30-0.40% BAC. Progressive impairment levels: 0.08-0.10% (Legally Intoxicated)—impaired motor coordination, balance, speech, vision, reaction time, and hearing. Poor judgment, self-control, reasoning, and memory formation. 0.10-0.15% (Severe Impairment)—significant motor impairment making walking and coordination very difficult. Vomiting common (protective reflex to prevent further intake). Judgment severely compromised. Major accident risk. 0.15-0.25% (Very High Risk)—gross motor impairment, inability to maintain posture/balance. Mental confusion, disorientation, dizziness. Blackout drinking—anterograde amnesia preventing new memory formation even while conscious. Vomiting and aspiration risk. 0.25-0.35% (Medical Emergency)—severe alcohol poisoning/intoxication. Loss of consciousness, stupor, severely depressed respiratory and cardiovascular function. Seizure risk. Loss of bladder/bowel control. Hypothermia from impaired temperature regulation. Requires immediate medical intervention. 0.35-0.45%+ (Potentially Fatal)—coma, complete unconscious state with minimal/absent reflexes. Respiratory depression or arrest (breathing stops). Bradycardia (dangerously slow heart rate) or cardiac arrest. Fatal aspiration of vomit. Death from respiratory failure or cardiovascular collapse in 50%+ of cases without intensive medical support. Critical danger signs requiring emergency medical services (call 911 immediately): unconsciousness or inability to wake the person, slow/irregular breathing (fewer than 8 breaths per minute or 10+ seconds between breaths), hypothermia—cold, clammy, bluish skin, seizures or convulsions, and persistent vomiting while unconscious (aspiration risk). Important: tolerance to alcohol's euphoric effects does NOT equal tolerance to its lethal effects—chronic heavy drinkers can function at BAC levels that would incapacitate occasional drinkers, but remain at equal risk for respiratory depression and death at very high BAC. Factors increasing fatal risk: rapid consumption (body cannot trigger vomiting reflex before dangerous levels reached), mixing alcohol with sedatives/opioids (synergistic respiratory depression), pre-existing health conditions (cardiovascular disease, diabetes, liver disease), and dehydration/electrolyte imbalances. Protective measures during acute intoxication: place unconscious person in recovery position (on their side, not back) to prevent aspiration, never leave alone—monitor breathing and consciousness continuously, do NOT induce vomiting or give food/liquid to unconscious person, seek immediate emergency medical care for concerning symptoms.",
    order: 6
  }
];

export default function BloodAlcoholClient({ relatedCalculators = defaultRelatedCalculators }: BloodAlcoholClientProps) {
  const { getH1, getSubHeading } = usePageSEO('blood-alcohol-calculator');

  const [gender, setGender] = useState<Gender>('male');
  const [weight, setWeight] = useState(180);
  const [weightUnit, setWeightUnit] = useState<WeightUnit>('lbs');
  const [drinks, setDrinks] = useState(3);
  const [timePeriod, setTimePeriod] = useState(2);

  const [currentBAC, setCurrentBAC] = useState(0);
  const [status, setStatus] = useState('Enter information above');
  const [statusDescription, setStatusDescription] = useState('');
  const [timeToSober, setTimeToSober] = useState('--');
  const [bacColor, setBacColor] = useState('bg-gray-100');
  const [bacTextColor, setBacTextColor] = useState('text-gray-600');
  const [statusColor, setStatusColor] = useState('text-gray-700');

  useEffect(() => {
    calculateBAC();
  }, [gender, weight, weightUnit, drinks, timePeriod]);

  const lbsToKg = (lbs: number) => lbs * 0.453592;

  const calculateBAC = () => {
    if (weight <= 0 || drinks < 0 || timePeriod < 0) {
      resetResults();
      return;
    }

    const r = gender === 'male' ? MALE_R : FEMALE_R;

    // Convert weight to kg if needed
    const weightKg = weightUnit === 'lbs' ? lbsToKg(weight) : weight;

    // Calculate grams of alcohol consumed (1 standard drink = 14g alcohol)
    const alcoholGrams = drinks * 14;

    // Widmark formula: BAC = (A / (r × W)) - (β × t)
    // Where: A = alcohol in grams, r = gender constant, W = weight in kg, β = elimination rate, t = time
    const peakBAC = alcoholGrams / (r * weightKg);
    const bac = Math.max(0, peakBAC - (ALCOHOL_ELIMINATION_RATE * timePeriod));

    setCurrentBAC(bac);
    updateBACDisplay(bac);
    updateStatus(bac);
    updateTimeToSober(bac);
  };

  const updateBACDisplay = (bac: number) => {
    // Color code based on BAC level
    if (bac >= 0.16) {
      setBacColor('bg-red-200 border-2 border-red-500');
      setBacTextColor('text-red-800');
    } else if (bac >= 0.08) {
      setBacColor('bg-red-100 border-2 border-red-400');
      setBacTextColor('text-red-700');
    } else if (bac >= 0.05) {
      setBacColor('bg-orange-100 border-2 border-orange-400');
      setBacTextColor('text-orange-700');
    } else if (bac >= 0.02) {
      setBacColor('bg-yellow-100 border-2 border-yellow-400');
      setBacTextColor('text-yellow-700');
    } else {
      setBacColor('bg-green-100 border-2 border-green-400');
      setBacTextColor('text-green-700');
    }
  };

  const updateStatus = (bac: number) => {
    if (bac >= 0.16) {
      setStatus('EXTREMELY DANGEROUS');
      setStatusDescription('Risk of coma or death. Seek immediate medical attention.');
      setStatusColor('text-red-800');
    } else if (bac >= 0.08) {
      setStatus('LEGALLY INTOXICATED');
      setStatusDescription('Illegal to drive in all US states. Severely impaired.');
      setStatusColor('text-red-700');
    } else if (bac >= 0.05) {
      setStatus('IMPAIRED');
      setStatusDescription('Illegal to drive in some states. Judgment and coordination affected.');
      setStatusColor('text-orange-700');
    } else if (bac >= 0.02) {
      setStatus('MILD IMPAIRMENT');
      setStatusDescription('Some loss of judgment. Not safe for commercial drivers or under 21.');
      setStatusColor('text-yellow-700');
    } else {
      setStatus('MINIMAL IMPAIRMENT');
      setStatusDescription('Generally considered safe for most adults 21+.');
      setStatusColor('text-green-700');
    }
  };

  const updateTimeToSober = (bac: number) => {
    if (bac <= 0) {
      setTimeToSober('Now');
      return;
    }

    const hoursToSober = bac / ALCOHOL_ELIMINATION_RATE;

    if (hoursToSober < 1) {
      setTimeToSober(`${Math.round(hoursToSober * 60)} minutes`);
    } else if (hoursToSober < 24) {
      const hours = Math.floor(hoursToSober);
      const minutes = Math.round((hoursToSober - hours) * 60);
      setTimeToSober(`${hours}h ${minutes}m`);
    } else {
      setTimeToSober('24+ hours');
    }
  };

  const resetResults = () => {
    setCurrentBAC(0);
    setStatus('Enter information above');
    setStatusDescription('');
    setTimeToSober('--');
    setStatusColor('text-gray-700');
    setBacColor('bg-gray-100');
    setBacTextColor('text-gray-600');
  };

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-6 md:py-8">
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-lg sm:text-xl md:text-2xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Blood Alcohol Calculator Online')}</h1>
        <p className="text-sm md:text-lg text-gray-600">
          Calculate your estimated blood alcohol content for educational purposes
        </p>

        {/* Important Warning */}
        <div className="bg-red-50 border-l-4 border-red-500 p-3 sm:p-4 mt-6 text-left max-w-2xl mx-auto">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5 text-red-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-xs sm:text-sm text-red-700">
                <strong>Warning:</strong> This calculator provides estimates only and should not be used to determine if you&apos;re safe to drive.
                Many factors affect BAC that aren&apos;t included in this calculation. Never drink and drive.
              </p>
            </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />
          </div>
        </div>
      </div>

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-5 md:gap-6">
          {/* Input Section */}
          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Enter Your Information</h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
              <div className="flex space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={gender === 'male'}
                    onChange={() => setGender('male')}
                    className="mr-2 text-blue-600"
                  />
                  <span>Male</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={gender === 'female'}
                    onChange={() => setGender('female')}
                    className="mr-2 text-blue-600"
                  />
                  <span>Female</span>
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Weight</label>
              <div className="flex">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
                  min="50"
                  max="500"
                  placeholder="e.g., 180"
                  className="flex-1 px-3 py-3 border border-gray-300 rounded-l-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <select
                  value={weightUnit}
                  onChange={(e) => setWeightUnit(e.target.value as WeightUnit)}
                  className="px-3 py-3 border border-l-0 border-gray-300 rounded-r-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                >
                  <option value="lbs">lbs</option>
                  <option value="kg">kg</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Number of Drinks</label>
              <input
                type="number"
                value={drinks}
                onChange={(e) => setDrinks(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.5"
                placeholder="e.g., 3"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">1 drink = 12oz beer (5%), 5oz wine (12%), or 1.5oz spirits (40%)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Time Period (hours)</label>
              <input
                type="number"
                value={timePeriod}
                onChange={(e) => setTimePeriod(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.25"
                placeholder="e.g., 2"
                className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <p className="text-xs text-gray-500 mt-1">Time over which drinks were consumed</p>
            </div>

            {/* Drink Type Guide */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Standard Drink Guide</h4>
              <div className="space-y-1 text-xs sm:text-sm text-blue-700">
                <div className="flex justify-between">
                  <span>Beer (12 oz, 5% ABV):</span>
                  <span className="font-medium">1 drink</span>
                </div>
                <div className="flex justify-between">
                  <span>Wine (5 oz, 12% ABV):</span>
                  <span className="font-medium">1 drink</span>
                </div>
                <div className="flex justify-between">
                  <span>Spirits (1.5 oz, 40% ABV):</span>
                  <span className="font-medium">1 drink</span>
                </div>
                <div className="flex justify-between">
                  <span>Strong Beer (12 oz, 8% ABV):</span>
                  <span className="font-medium">1.6 drinks</span>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
            <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">BAC Results</h3>

            <div className="space-y-4">
              {/* Current BAC */}
              <div className={`text-center p-4 rounded-lg ${bacColor}`}>
                <div className={`text-3xl sm:text-4xl font-bold ${bacTextColor}`}>{currentBAC.toFixed(3)}</div>
                <div className="text-gray-700 text-sm md:text-base">Blood Alcohol Content (%)</div>
              </div>

              {/* Status */}
              <div className="bg-white rounded-lg p-4 text-center">
                <div className={`text-base md:text-lg font-semibold ${statusColor}`}>{status}</div>
                {statusDescription && <div className="text-xs md:text-sm text-gray-600 mt-1">{statusDescription}</div>}
              </div>

              {/* Time to Sober */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-2 text-sm md:text-base">Time to Reach 0.00%</h4>
                <div className="text-xl md:text-2xl font-bold text-blue-600">{timeToSober}</div>
                <div className="text-xs md:text-sm text-gray-600 mt-1">Approximate time from now</div>
              </div>
{/* Legal Limits */}
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">Legal BAC Limits</h4>
                <div className="space-y-2 text-xs md:text-sm">
                  <div className="flex justify-between">
                    <span>Most US States (21+):</span>
                    <span className="font-medium">0.08%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commercial Drivers:</span>
                    <span className="font-medium">0.04%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Under 21 (Zero Tolerance):</span>
                    <span className="font-medium">0.00-0.02%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Some States (Utah):</span>
                    <span className="font-medium">0.05%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* BAC Effects Chart */}
      <div className="bg-white rounded-xl shadow-lg p-4 sm:p-8 mb-8">
        <h3 className="text-lg md:text-2xl font-semibold text-gray-800 mb-6">BAC Effects and Impairment Levels</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-200 px-2 py-2 md:py-3 text-left text-xs md:text-sm">BAC Level</th>
                <th className="border border-gray-200 px-2 py-2 md:py-3 text-left text-xs md:text-sm">Legal Status</th>
                <th className="border border-gray-200 px-2 py-2 md:py-3 text-left text-xs md:text-sm">Physical/Mental Effects</th>
              </tr>
            </thead>
            <tbody>
              {bacEffects.map((effect, index) => (
                <tr key={index} className={effect.color}>
                  <td className="border border-gray-200 px-2 py-2 md:py-3 font-bold text-xs md:text-sm">{effect.range}</td>
                  <td className="border border-gray-200 px-2 py-2 md:py-3 text-xs md:text-sm">{effect.status}</td>
                  <td className="border border-gray-200 px-2 py-2 md:py-3 text-xs md:text-sm">{effect.effects}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Information Section */}
      <div className="bg-blue-50 rounded-lg p-3 sm:p-4 mb-8">
        <h3 className="text-lg md:text-xl font-semibold text-blue-800 mb-4">Important Information</h3>
        <div className="grid md:grid-cols-2 gap-6 text-blue-700 text-xs md:text-sm">
          <div>
            <h4 className="font-semibold mb-2">Factors Affecting BAC:</h4>
            <ul className="space-y-1">
              <li>• Body weight and composition</li>
              <li>• Gender (women typically higher BAC)</li>
              <li>• Food consumption</li>
              <li>• Drinking rate and time period</li>
              <li>• Medications and health conditions</li>
              <li>• Age and tolerance</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Safety Guidelines:</h4>
            <ul className="space-y-1">
              <li>• Never drink and drive</li>
              <li>• Plan safe transportation</li>
              <li>• Eat before and while drinking</li>
              <li>• Stay hydrated with water</li>
              <li>• Know your limits</li>
              <li>• Wait until completely sober</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Critical Safety Warning */}
      <div className="bg-red-50 border-2 border-red-500 rounded-xl p-3 sm:p-4 mb-8">
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0">
            <svg className="h-6 w-6 md:h-8 md:w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.1c-.77-.833-2.694-.833-3.464 0L3.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div>
            <h3 className="text-base md:text-xl font-bold text-red-800 mb-3">🚨 CRITICAL SAFETY WARNING</h3>
            <div className="text-xs md:text-sm text-red-800 space-y-2">
              <p><strong>DO NOT USE THIS CALCULATOR TO DETERMINE FITNESS TO DRIVE OR OPERATE MACHINERY.</strong></p>
              <p><strong>This calculator is for educational purposes only.</strong> Blood alcohol levels vary significantly based on numerous factors not captured by simple calculations:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Food intake, timing, and type</li>
                <li>Medications and health conditions</li>
                <li>Individual metabolism and body composition</li>
                <li>Drinking pattern and absorption rate</li>
                <li>Fatigue, stress, and other impairment factors</li>
              </ul>
              <p><strong>NEVER DRIVE AFTER CONSUMING ALCOHOL, REGARDLESS OF CALCULATOR RESULTS.</strong></p>
              <p><strong>Legal consequences:</strong> DUI/DWI laws vary by jurisdiction. The only safe BAC for driving is 0.00%.</p>
              <p><strong>If you&apos;ve been drinking:</strong> Use designated drivers, rideshare services, public transportation, or wait until completely sober.</p>
              <p className="text-red-900 font-bold">⚠️ This tool does not replace professional medical advice. Consult healthcare providers about alcohol consumption and its effects on your health.</p>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-12 bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl shadow-lg p-8 mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-6">Understanding Blood Alcohol Content: Science, Safety, and Metabolism</h2>

        <div className="space-y-6 text-gray-700">
          <div className="bg-white rounded-xl p-6 border-l-4 border-red-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">The Widmark Formula: The Science Behind BAC Calculation</h3>
            <p className="mb-3">
              This calculator employs the Widmark formula, developed by Swedish researcher Erik Widmark in the 1930s and remaining the gold standard for BAC estimation in forensic science, law enforcement, and medical research. The formula accurately predicts blood alcohol concentration based on measurable physiological parameters:
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-3 font-mono text-sm">
              <div className="mb-2"><strong>BAC = (A / (r × W)) - (β × t)</strong></div>
              <div className="text-xs space-y-1">
                <div>A = Total alcohol consumed in grams (standard drink = 14g)</div>
                <div>r = Gender-specific distribution ratio (0.68 males, 0.55 females)</div>
                <div>W = Body weight in kilograms</div>
                <div>β = Alcohol elimination rate (0.015% per hour average)</div>
                <div>t = Time elapsed since drinking began (hours)</div>
              </div>
            </div>
            <p>
              The gender-specific constant 'r' reflects fundamental biological differences: males average 60-68% total body water versus 52-55% in females, directly correlating with alcohol distribution volume. Because alcohol is water-soluble and distributes throughout body water (not fat tissue), individuals with higher body water percentages dilute consumed alcohol across larger volumes, achieving lower BAC concentrations. This explains why women typically experience 25-35% higher BAC than men after consuming equivalent alcohol amounts adjusted for body weight—their lower body water percentage concentrates alcohol in smaller distribution volume.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-orange-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Alcohol Metabolism: The Rate-Limiting Step</h3>
            <p className="mb-3">
              Unlike most nutrients that accelerate metabolism when consumed in larger quantities, alcohol metabolism proceeds at a fixed, zero-order kinetic rate—meaning the body eliminates a constant amount per hour regardless of BAC level. Understanding this pharmacokinetic principle is critical for interpreting calculator results:
            </p>
            <p className="mb-3">
              <strong>First-Pass Metabolism:</strong> When alcohol enters the stomach, approximately 20% undergoes immediate metabolism by gastric alcohol dehydrogenase (ADH) before entering the bloodstream—this 'first-pass' effect significantly reduces peak BAC. However, gastric ADH activity is 40-60% lower in women than men, explaining part of the gender difference in alcohol effects. Factors that bypass first-pass metabolism (drinking on empty stomach, carbonated beverages, rapid consumption) result in higher peak BAC by delivering more unmetabolized alcohol to the bloodstream.
            </p>
            <p className="mb-3">
              <strong>Hepatic Metabolism:</strong> The liver eliminates 90-95% of consumed alcohol through enzymatic pathways. The primary enzyme, alcohol dehydrogenase (ADH), converts ethanol to acetaldehyde—a toxic intermediate causing hangover symptoms and long-term damage. Acetaldehyde is then rapidly converted to acetate by aldehyde dehydrogenase (ALDH). This two-step process proceeds at approximately 7-10 grams of alcohol per hour (roughly one standard drink), explaining the standard 0.015% BAC elimination rate. The enzyme capacity cannot be increased through drinking more water, exercising, taking supplements, or other interventions—the liver simply cannot work faster.
            </p>
            <p>
              <strong>Individual Variation:</strong> While 0.015%/hour serves as the population average, individual elimination rates vary from 0.010-0.020%/hour due to genetic enzyme variants, liver size and health, chronic alcohol exposure (upregulating enzyme production), concurrent medications affecting liver enzyme activity, and age-related metabolic decline. This inherent variability means identical twins with identical alcohol consumption could show 30-40% differences in BAC at any given time.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-yellow-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Factors Affecting BAC Beyond Basic Calculations</h3>
            <p className="mb-3">
              BAC calculators provide estimates based on core variables—gender, weight, drinks consumed, and time—but numerous additional factors create substantial individual variation:
            </p>
            <div className="space-y-3">
              <div>
                <p className="font-semibold text-gray-800 mb-1">Food Intake and Gastric Emptying</p>
                <p className="text-sm">The single most influential variable not captured by basic calculations is food consumption. Eating before or during alcohol intake slows gastric emptying, reducing alcohol absorption rate and lowering peak BAC by 20-40%. High-protein and high-fat meals are most effective—they create a physical barrier in the stomach, delay gastric emptying through hormonal signals (cholecystokinin), and directly bind some alcohol molecules. Conversely, drinking on an empty stomach produces rapid absorption and higher peak BAC within 30-60 minutes versus 1-2 hours with food.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Beverage Type and Carbonation</p>
                <p className="text-sm">Carbonated alcoholic beverages (champagne, beer, mixed drinks with soda) accelerate alcohol absorption by 20-30% compared to non-carbonated drinks of equal alcohol content. Carbon dioxide increases gastric pressure, speeds gastric emptying, and expands stomach surface area for faster absorption. Additionally, higher alcohol concentrations (spirits at 40% ABV) can irritate the stomach lining and slow absorption via pyloric sphincter closure, while moderate concentrations (wine at 10-15% ABV) may absorb most efficiently.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Medications and Drug Interactions</p>
                <p className="text-sm">Over 150 common medications interact with alcohol metabolism: H2-blockers and proton pump inhibitors (Tagamet, Zantac, Prilosec) reduce gastric ADH activity, increasing absorption and BAC; aspirin and NSAIDs similarly inhibit gastric ADH; antibiotics like metronidazole inhibit ALDH, causing acetaldehyde accumulation and severe reactions; and diabetes medications combined with alcohol create hypoglycemia risk. Always consult medication information regarding alcohol interactions.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800 mb-1">Genetic Enzyme Variants</p>
                <p className="text-sm">Genetic polymorphisms in ADH and ALDH enzymes create substantial individual variation. Approximately 40-50% of East Asian populations carry an inactive ALDH2 variant, causing acetaldehyde accumulation after drinking (facial flushing, nausea, rapid heartbeat). Conversely, some populations carry more active ADH variants, accelerating ethanol-to-acetaldehyde conversion. These genetic differences can alter effective BAC and alcohol tolerance by 2-3 fold compared to population averages.</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-6 border-l-4 border-blue-500">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Progressive Impairment: What Each BAC Level Means</h3>
            <p className="mb-3">
              Alcohol's effects on the central nervous system follow a predictable dose-response relationship, with progressive impairment as BAC increases:
            </p>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-semibold text-gray-800">0.00-0.02% BAC (Minimal Effect)</p>
                <p>Most individuals experience no obvious impairment, though sensitive testing reveals slight decline in multitasking ability and divided attention. Legal for driving in all jurisdictions for adults 21+.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.02-0.05% BAC (Mild Impairment)</p>
                <p>Relaxation, slight euphoria, reduced inhibition, and decreased ability to track moving objects visually. Judgment begins to decline, affecting risk assessment. Illegal for commercial drivers (0.04% limit) and drivers under 21 in zero-tolerance states.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.05-0.08% BAC (Significant Impairment)</p>
                <p>Reduced coordination, impaired ability to detect danger, and decreased small-muscle control. Difficulty steering and reduced response to emergency driving situations. Studies show 38% increased crash risk at 0.05% BAC. Illegal in Utah and most countries globally.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.08-0.10% BAC (Legal Intoxication - US Standard)</p>
                <p>Definite impairment of muscle coordination, balance, speech, vision, reaction time, and hearing. Poor judgment, self-control, reasoning. Short-term memory impairment. Illegal to drive in all 50 US states. Crash risk increased 11-fold versus sober drivers.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.10-0.20% BAC (Severe Intoxication)</p>
                <p>Gross motor impairment, loss of balance, slurred speech, potential for blackout drinking (anterograde amnesia—unable to form new memories while conscious). Vomiting common. Severely reduced reaction time and danger recognition. Requires assistance to walk safely.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.20-0.30% BAC (Extreme Intoxication)</p>
                <p>Severe disorientation, confusion, possible loss of consciousness, inability to walk without assistance. Blackouts highly likely. Vomiting reflex may be suppressed, creating aspiration risk. Immediate medical evaluation recommended.</p>
              </div>
              <div>
                <p className="font-semibold text-gray-800">0.30-0.40%+ BAC (Medical Emergency)</p>
                <p>Life-threatening alcohol poisoning. Loss of consciousness, coma, depressed/absent reflexes, respiratory depression, bradycardia (slow heart rate), hypothermia, seizures. Death from respiratory arrest, cardiac failure, or aspiration in 50%+ without intensive medical intervention. Call 911 immediately.</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-100 to-orange-100 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Why You Should NEVER Use BAC Calculators to Determine Driving Safety</h3>
            <p className="mb-3">
              While this calculator provides scientifically-based BAC estimates for educational purposes, it should never be used to determine fitness to drive or operate machinery. Critical reasons include:
            </p>
            <ul className="space-y-2 text-sm">
              <li><strong>Impairment Begins Below Legal Limits:</strong> Research demonstrates measurable impairment in reaction time, judgment, and divided attention at BAC levels as low as 0.02-0.03%—well below the 0.08% legal limit. The legal threshold represents an arbitrary enforcement standard, not a safety threshold.</li>
              <li><strong>Individual Variation is Substantial:</strong> The 20-50% variability in actual BAC versus calculated estimates means you could be legally intoxicated while the calculator shows 0.06%, or vice versa. Factors like food, medications, genetics, and drinking pattern create unpredictable variation.</li>
              <li><strong>Calculator Accuracy is Limited:</strong> This tool cannot account for food intake, beverage carbonation, medication interactions, individual metabolism, genetic variants, liver function, or drinking patterns—all of which significantly affect actual BAC.</li>
              <li><strong>Subjective Impairment Doesn't Match BAC:</strong> Tolerance to alcohol's subjective effects (euphoria, sedation) develops much faster than tolerance to its impairing effects on coordination, reaction time, and judgment. Feeling "fine" does not mean you're safe to drive.</li>
              <li><strong>Legal Consequences are Severe:</strong> DUI/DWI convictions carry criminal records, license suspension, thousands in fines, potential jail time, and employment consequences—consequences that persist for years and cannot be undone by claiming you "calculated" your BAC.</li>
              <li><strong>The Only Safe BAC is 0.00%:</strong> Designated drivers, rideshare services (Uber, Lyft), public transportation, and overnight accommodation are always safer and more cost-effective alternatives than risking impaired driving, regardless of calculated BAC.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <CalculatorMobileMrec2 />



      {/* FAQ Section */}
      <div className="mb-8">
        <FirebaseFAQs pageId="blood-alcohol-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

{/* Related Calculators */}
      <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4">
        <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-6">Related Health Calculators</h2>
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
    </div>
  );
}
