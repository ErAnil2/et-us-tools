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
  color: string;
  icon: string;
}

interface PetCostCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface BasicResults {
  petType: string;
  petSize: string;
  monthlyFood: number;
  annualVet: number;
  monthlyGrooming: number;
  monthlySupplies: number;
  monthlyInsurance: number;
  monthlyTotal: number;
  annualTotal: number;
  initialSetup: number;
}

interface YearlyBreakdown {
  year: number;
  petAge: number;
  cost: number;
  isSenior: boolean;
}

interface LifetimeResults {
  currentAge: number;
  lifespan: number;
  remainingYears: number;
  baseAnnualCost: number;
  totalLifetimeCost: number;
  averageAnnualCost: number;
  yearlyBreakdown: YearlyBreakdown[];
}

const petCostData = {
  dog: {
    small: { food: 40, vet: 600, grooming: 50, supplies: 30, insurance: 35 },
    medium: { food: 60, vet: 700, grooming: 70, supplies: 40, insurance: 45 },
    large: { food: 90, vet: 800, grooming: 80, supplies: 50, insurance: 55 },
    'extra-large': { food: 120, vet: 900, grooming: 100, supplies: 60, insurance: 65 }
  },
  cat: {
    small: { food: 25, vet: 400, grooming: 30, supplies: 25, insurance: 25 },
    medium: { food: 35, vet: 450, grooming: 40, supplies: 30, insurance: 30 },
    large: { food: 45, vet: 500, grooming: 50, supplies: 35, insurance: 35 },
    'extra-large': { food: 45, vet: 500, grooming: 50, supplies: 35, insurance: 35 }
  },
  bird: { small: { food: 20, vet: 300, grooming: 10, supplies: 20, insurance: 20 } },
  rabbit: { small: { food: 25, vet: 250, grooming: 15, supplies: 20, insurance: 20 } },
  fish: { small: { food: 10, vet: 50, grooming: 0, supplies: 15, insurance: 0 } },
  hamster: { small: { food: 15, vet: 150, grooming: 5, supplies: 15, insurance: 15 } }
};

const locationMultipliers = { rural: 0.8, suburban: 1.0, urban: 1.3, metro: 1.6 };
const careLevelMultipliers = { basic: 0.7, standard: 1.0, premium: 1.5 };
const healthMultipliers = { excellent: 1.0, good: 1.2, fair: 1.5, poor: 2.0 };
const ageMultipliers = { puppy: 1.3, young: 1.0, adult: 1.0, senior: 1.4 };

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Pet Cost Calculator?",
    answer: "A Pet Cost Calculator is a free online tool designed to help you quickly and accurately calculate pet cost-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Pet Cost Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Pet Cost Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Pet Cost Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PetCostCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PetCostCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('pet-cost-calculator');

  const [petType, setPetType] = useState('dog');
  const [petSize, setPetSize] = useState('medium');
  const [petAge, setPetAge] = useState('puppy');
  const [location, setLocation] = useState('suburban');
  const [careLevel, setCareLevel] = useState('standard');
  const [healthStatus, setHealthStatus] = useState('excellent');

  const [currentAge, setCurrentAge] = useState(1);
  const [lifespan, setLifespan] = useState(12);
  const [inflationRate, setInflationRate] = useState(3);
  const [baseAnnual, setBaseAnnual] = useState(2000);

  const [includeBoarding, setIncludeBoarding] = useState(true);
  const [includeTraining, setIncludeTraining] = useState(true);
  const [includePremiumFood, setIncludePremiumFood] = useState(false);
  const [includeDental, setIncludeDental] = useState(true);

  const [basicResults, setBasicResults] = useState<BasicResults | null>(null);
  const [lifetimeResults, setLifetimeResults] = useState<LifetimeResults | null>(null);
  const [showResults, setShowResults] = useState(false);

  const calculateInitialSetup = (petType: string, petSize: string, careLevel: string): number => {
    const baseCosts: Record<string, Record<string, number>> = {
      dog: { small: 400, medium: 600, large: 800, 'extra-large': 1000 },
      cat: { small: 200, medium: 300, large: 300, 'extra-large': 300 },
      bird: { small: 300 },
      rabbit: { small: 200 },
      fish: { small: 150 },
      hamster: { small: 100 }
    };

    const multiplier = careLevelMultipliers[careLevel as keyof typeof careLevelMultipliers];
    return (baseCosts[petType]?.[petSize] || baseCosts[petType]?.small || 200) * multiplier;
  };

  const calculateBasicCosts = () => {
    const baseCosts = (petCostData as any)[petType]?.[petSize] || (petCostData as any)[petType]?.small;

    const monthlyFood = baseCosts.food * locationMultipliers[location as keyof typeof locationMultipliers] * careLevelMultipliers[careLevel as keyof typeof careLevelMultipliers];
    const annualVet = baseCosts.vet * locationMultipliers[location as keyof typeof locationMultipliers] * healthMultipliers[healthStatus as keyof typeof healthMultipliers] * ageMultipliers[petAge as keyof typeof ageMultipliers];
    const monthlyGrooming = baseCosts.grooming * locationMultipliers[location as keyof typeof locationMultipliers] * careLevelMultipliers[careLevel as keyof typeof careLevelMultipliers];
    const monthlySupplies = baseCosts.supplies * careLevelMultipliers[careLevel as keyof typeof careLevelMultipliers];
    const monthlyInsurance = baseCosts.insurance * locationMultipliers[location as keyof typeof locationMultipliers];

    const monthlyTotal = monthlyFood + (annualVet / 12) + monthlyGrooming + monthlySupplies + monthlyInsurance;
    const annualTotal = monthlyTotal * 12;

    const initialSetup = calculateInitialSetup(petType, petSize, careLevel);

    setBasicResults({
      petType,
      petSize,
      monthlyFood,
      annualVet,
      monthlyGrooming,
      monthlySupplies,
      monthlyInsurance,
      monthlyTotal,
      annualTotal,
      initialSetup
    });
    setShowResults(true);
  };

  const calculateLifetimeCosts = () => {
    let adjustedBaseAnnual = baseAnnual;

    if (includeBoarding) adjustedBaseAnnual += 600;
    if (includeTraining) adjustedBaseAnnual += 400;
    if (includePremiumFood) adjustedBaseAnnual += 500;
    if (includeDental) adjustedBaseAnnual += 300;

    const remainingYears = lifespan - currentAge;
    const seniorAge = Math.max(7, lifespan * 0.7);
    const seniorMultiplier = 1.5;

    let totalLifetimeCost = 0;
    const yearlyBreakdown: YearlyBreakdown[] = [];

    for (let year = 1; year <= remainingYears; year++) {
      const petAgeThisYear = currentAge + year;
      let yearCost = adjustedBaseAnnual * Math.pow(1 + inflationRate / 100, year - 1);

      if (petAgeThisYear >= seniorAge) {
        yearCost *= seniorMultiplier;
      }

      totalLifetimeCost += yearCost;

      if (year <= 10) {
        yearlyBreakdown.push({
          year: year,
          petAge: petAgeThisYear,
          cost: yearCost,
          isSenior: petAgeThisYear >= seniorAge
        });
      }
    }

    setLifetimeResults({
      currentAge,
      lifespan,
      remainingYears,
      baseAnnualCost: adjustedBaseAnnual,
      totalLifetimeCost,
      averageAnnualCost: totalLifetimeCost / remainingYears,
      yearlyBreakdown
    });
  };

  const generateComparison = () => {
    const comparisons = [
      { pet: 'Small Dog', annual: '$1,800', lifetime: '$21,600', lifespan: '12-15 years', emoji: '🐕' },
      { pet: 'Large Dog', annual: '$3,200', lifetime: '$38,400', lifespan: '10-13 years', emoji: '🐕‍🦺' },
      { pet: 'Indoor Cat', annual: '$1,400', lifetime: '$21,000', lifespan: '12-18 years', emoji: '🐈' },
      { pet: 'Rabbit', annual: '$800', lifetime: '$8,000', lifespan: '8-12 years', emoji: '🐰' },
      { pet: 'Bird (Parrot)', annual: '$1,200', lifetime: '$36,000', lifespan: '20-30 years', emoji: '🦜' },
      { pet: 'Fish (Aquarium)', annual: '$400', lifetime: '$4,000', lifespan: '5-10 years', emoji: '🐠' }
    ];

    return comparisons;
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      calculateBasicCosts();
      calculateLifetimeCosts();
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="max-w-[1180px] mx-auto px-3 sm:px-4 md:px-6 py-6 md:py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 mb-4 md:mb-6">
        <Link href="/us/tools" className="text-blue-600 hover:text-blue-800 text-sm md:text-base">Home</Link>
        <span className="text-gray-400">›</span>
        <span className="text-gray-600 text-sm md:text-base">Pet Cost Calculator</span>
      </div>

      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 md:mb-3">{getH1('Pet Cost Calculator')}</h1>
        <p className="text-sm md:text-base text-gray-600">Calculate annual and lifetime costs of pet ownership with detailed expense breakdown</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        {/* Calculator */}
        <div className="lg:col-span-2 space-y-4 md:space-y-6">
          {/* Annual Costs Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6 mb-4 md:mb-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-3 md:mb-4">
              <span>🐾</span> Pet Information
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pet Type</label>
                <select
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="dog">Dog</option>
                  <option value="cat">Cat</option>
                  <option value="bird">Bird (Parrot/Cockatiel)</option>
                  <option value="rabbit">Rabbit</option>
                  <option value="fish">Fish (Aquarium)</option>
                  <option value="hamster">Hamster/Guinea Pig</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pet Size (Dogs/Cats)</label>
                <select
                  value={petSize}
                  onChange={(e) => setPetSize(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="small">Small (Under 25 lbs)</option>
                  <option value="medium">Medium (25-60 lbs)</option>
                  <option value="large">Large (60-90 lbs)</option>
                  <option value="extra-large">Extra Large (90+ lbs)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pet Age</label>
                <select
                  value={petAge}
                  onChange={(e) => setPetAge(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="puppy">Puppy/Kitten (0-1 year)</option>
                  <option value="young">Young Adult (1-3 years)</option>
                  <option value="adult">Adult (3-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Location Type</label>
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rural">Rural Area</option>
                  <option value="suburban">Suburban</option>
                  <option value="urban">Urban</option>
                  <option value="metro">Major Metro Area</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Care Level</label>
                <select
                  value={careLevel}
                  onChange={(e) => setCareLevel(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="basic">Basic Care</option>
                  <option value="standard">Standard Care</option>
                  <option value="premium">Premium Care</option>
                </select>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Health Status</label>
                <select
                  value={healthStatus}
                  onChange={(e) => setHealthStatus(e.target.value)}
                  className="w-full px-3 py-2 md:py-2.5 text-sm md:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="excellent">Excellent Health</option>
                  <option value="good">Good Health</option>
                  <option value="fair">Fair (Minor Issues)</option>
                  <option value="poor">Poor (Chronic Issues)</option>
                </select>
              </div>
            </div>

            <button
              onClick={calculateBasicCosts}
              className="w-full px-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
            >
              Calculate Annual Costs
            </button>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Results Section */}
          {showResults && basicResults && (
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-4">
                <span>💰</span> Annual Cost Breakdown
              </h3>
              <div>
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 md:p-6">
                    <h4 className="text-base md:text-lg font-semibold text-blue-900 mb-4">Annual Total</h4>
                    <div className="text-center mb-4">
                      <div className="text-3xl md:text-4xl font-bold text-blue-900">${basicResults.annualTotal.toFixed(0)}</div>
                      <div className="text-sm text-blue-700 mt-1">per year</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Per Month:</span>
                        <span className="font-semibold">${Math.round(basicResults.monthlyTotal)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Per Week:</span>
                        <span className="font-semibold">${(basicResults.annualTotal/52).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Per Day:</span>
                        <span className="font-semibold">${(basicResults.annualTotal/365).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 md:p-6">
                    <h4 className="text-base md:text-lg font-semibold text-green-900 mb-4">Monthly Breakdown</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-green-800">Food & Treats:</span>
                        <span className="font-semibold">${basicResults.monthlyFood.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Veterinary:</span>
                        <span className="font-semibold">${(basicResults.annualVet/12).toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Grooming:</span>
                        <span className="font-semibold">${basicResults.monthlyGrooming.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Supplies & Toys:</span>
                        <span className="font-semibold">${basicResults.monthlySupplies.toFixed(0)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-green-800">Pet Insurance:</span>
                        <span className="font-semibold">${basicResults.monthlyInsurance.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-gradient-to-br from-purple-50 to-pink-100 rounded-lg p-4 md:p-6">
                  <h4 className="text-base md:text-lg font-semibold text-purple-900 mb-3">🏠 First Year Total</h4>
                  <div className="text-center">
                    <div className="text-2xl md:text-3xl font-bold text-purple-900">${(basicResults.annualTotal + basicResults.initialSetup).toFixed(0)}</div>
                    <div className="text-sm text-purple-700 mt-1">Including ${basicResults.initialSetup.toFixed(0)} in initial setup costs</div>
                  </div>
                </div>

                <div className="mt-6 bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h5 className="font-semibold text-amber-900 mb-2">💡 Cost-Saving Tips for {basicResults.petType.charAt(0).toUpperCase() + basicResults.petType.slice(1)}s</h5>
                  <ul className="text-sm text-amber-800 space-y-1">
                    {basicResults.annualVet > 800 && <li>• Consider pet insurance to reduce unexpected vet bills</li>}
                    {basicResults.monthlyGrooming > 60 && <li>• Learn basic grooming techniques to save on professional services</li>}
                    <li>• Buy quality food in bulk to save 10-20%</li>
                    <li>• Keep up with preventive care to avoid expensive treatments</li>
                    <li>• Shop around for veterinary services - prices vary significantly</li>
                    <li>• Set aside $50-100/month for unexpected expenses</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Lifetime Analysis Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
              <span>📊</span> Lifetime Cost Analysis
            </h2>

            <div className="grid md:grid-cols-2 gap-4 mb-3 sm:mb-4 md:mb-6">
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Pet&apos;s Current Age (Years)</label>
                <input
                  type="number"
                  value={currentAge}
                  onChange={(e) => setCurrentAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="0"
                  max="20"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Expected Lifespan (Years)</label>
                <input
                  type="number"
                  value={lifespan}
                  onChange={(e) => setLifespan(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  min="1"
                  max="25"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Annual Cost Increase (%)</label>
                <input
                  type="number"
                  value={inflationRate}
                  onChange={(e) => setInflationRate(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  step="0.1"
                />
              </div>
              <div>
                <label className="block text-xs md:text-sm font-medium text-gray-700 mb-2">Base Annual Cost ($)</label>
                <input
                  type="number"
                  value={baseAnnual}
                  onChange={(e) => setBaseAnnual(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="mb-3 sm:mb-4 md:mb-6">
              <h4 className="font-semibold text-gray-800 mb-3 text-sm md:text-base">Include Optional Expenses</h4>
              <div className="grid md:grid-cols-2 gap-3">
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={includeBoarding}
                    onChange={(e) => setIncludeBoarding(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Regular Boarding ($600/year)</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={includeTraining}
                    onChange={(e) => setIncludeTraining(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Training Classes ($400/year)</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={includePremiumFood}
                    onChange={(e) => setIncludePremiumFood(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Premium Food ($500/year extra)</span>
                </label>
                <label className="flex items-center text-sm">
                  <input
                    type="checkbox"
                    checked={includeDental}
                    onChange={(e) => setIncludeDental(e.target.checked)}
                    className="mr-2"
                  />
                  <span>Regular Dental Care ($300/year)</span>
                </label>
              </div>
            </div>

            <button
              onClick={calculateLifetimeCosts}
              className="w-full px-2 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
            >
              Calculate Lifetime Costs
            </button>

            {lifetimeResults && (
              <div className="mt-6">
                <div className="grid md:grid-cols-2 gap-4 md:gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-4 md:p-6">
                    <h4 className="text-base md:text-lg font-semibold text-blue-900 mb-4">Lifetime Summary</h4>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-blue-800">Current Age:</span>
                        <span className="font-semibold">{lifetimeResults.currentAge} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Expected Lifespan:</span>
                        <span className="font-semibold">{lifetimeResults.lifespan} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Remaining Years:</span>
                        <span className="font-semibold">{lifetimeResults.remainingYears} years</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-800">Average Annual:</span>
                        <span className="font-semibold">${lifetimeResults.averageAnnualCost.toFixed(0)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg p-4 md:p-6">
                    <h4 className="text-base md:text-lg font-semibold text-green-900 mb-4">Total Lifetime Cost</h4>
                    <div className="text-center">
                      <div className="text-3xl md:text-4xl font-bold text-green-900 mb-2">
                        ${lifetimeResults.totalLifetimeCost.toFixed(0).toLocaleString()}
                      </div>
                      <p className="text-sm text-green-800">Over {lifetimeResults.remainingYears} years</p>
                    </div>

                    <div className="mt-4 space-y-2 text-sm">
                      <div className="bg-white rounded p-2 flex justify-between">
                        <span className="text-gray-600">Monthly saving needed:</span>
                        <span className="font-semibold">${(lifetimeResults.totalLifetimeCost / (lifetimeResults.remainingYears * 12)).toFixed(0)}</span>
                      </div>
                      <div className="bg-white rounded p-2 flex justify-between">
                        <span className="text-gray-600">Cost per day:</span>
                        <span className="font-semibold">${(lifetimeResults.totalLifetimeCost / (lifetimeResults.remainingYears * 365)).toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 mt-4">
                  <h5 className="font-semibold mb-2 text-sm md:text-base">📅 Yearly Cost Projection</h5>
                  <div className="space-y-1 text-xs md:text-sm max-h-60 overflow-y-auto">
                    {lifetimeResults.yearlyBreakdown.map((year) => (
                      <div key={year.year} className={`flex justify-between ${year.isSenior ? 'text-orange-600 font-medium' : ''}`}>
                        <span>Year {year.year} (Age {year.petAge}):</span>
                        <span>${year.cost.toFixed(0)}{year.isSenior ? ' (Senior)' : ''}</span>
                      </div>
                    ))}
                    {lifetimeResults.remainingYears > 10 && (
                      <div className="text-center text-gray-500 mt-2">... and {lifetimeResults.remainingYears - 10} more years</div>
                    )}
                  </div>
                </div>

                <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <h5 className="font-semibold text-orange-800 mb-2">🐾 Lifetime Pet Planning Tips</h5>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Start a dedicated pet savings account early</li>
                    <li>• Senior pets (7+ years) typically cost 50-100% more</li>
                    <li>• Consider pet insurance when your pet is young</li>
                    <li>• Budget $1,000-5,000 for emergency expenses</li>
                    <li>• Preventive care is always cheaper than emergency treatment</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
{/* Compare Pets Section */}
          <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
            <h2 className="text-base md:text-lg font-bold text-gray-900 mb-4">
              <span>🔍</span> Compare Pet Costs
            </h2>
            <p className="text-sm text-gray-600 mb-4">See annual cost comparison across different pet types</p>
            <div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {generateComparison().map((pet) => (
                  <div key={pet.pet} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border-2 border-gray-200 hover:border-blue-400 transition-colors">
                    <div className="text-xl sm:text-2xl md:text-3xl text-center mb-2">{pet.emoji}</div>
                    <h4 className="font-bold text-center text-gray-900 mb-3">{pet.pet}</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Annual:</span>
                        <strong className="text-blue-600">{pet.annual}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lifetime:</span>
                        <strong className="text-green-600">{pet.lifetime}</strong>
                      </div>
                      <div className="text-center text-xs text-gray-500 mt-2 pt-2 border-t">
                        Lifespan: {pet.lifespan}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
                <strong>Note:</strong> Costs vary based on location, care level, health status, and lifestyle. Premium care and urban locations can increase costs by 30-60%.
              </div>
            </div>
          </div>
        </div>

        {/* Info Sidebar */}
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
            <h3 className="text-base md:text-lg font-bold text-blue-900 mb-2 md:mb-3">🐕 Average Annual Costs</h3>
            <div className="space-y-2 text-xs md:text-sm text-blue-800">
              <div className="flex justify-between">
                <span>Small Dog:</span>
                <strong>$1,500-2,500</strong>
              </div>
              <div className="flex justify-between">
                <span>Large Dog:</span>
                <strong>$2,500-4,000</strong>
              </div>
              <div className="flex justify-between">
                <span>Indoor Cat:</span>
                <strong>$1,000-2,000</strong>
              </div>
              <div className="flex justify-between">
                <span>Rabbit:</span>
                <strong>$600-1,200</strong>
              </div>
              <div className="flex justify-between">
                <span>Bird:</span>
                <strong>$500-1,500</strong>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 md:p-6 border border-green-200">
            <h3 className="text-base md:text-lg font-bold text-green-900 mb-2 md:mb-3">🏥 Medical Expenses</h3>
            <div className="space-y-1 text-xs md:text-sm text-green-800">
              <div><strong>Annual Checkups:</strong> $200-500</div>
              <div><strong>Vaccinations:</strong> $75-200/year</div>
              <div><strong>Dental Cleaning:</strong> $200-500</div>
              <div><strong>Emergency Visit:</strong> $500-2,000</div>
              <div><strong>Surgery:</strong> $1,500-5,000+</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 md:p-6 border border-purple-200">
            <h3 className="text-base md:text-lg font-bold text-purple-900 mb-2 md:mb-3">🍖 Food & Supplies</h3>
            <div className="space-y-1 text-xs md:text-sm text-purple-800">
              <div><strong>Small Pet Food:</strong> $20-50/month</div>
              <div><strong>Large Dog Food:</strong> $60-120/month</div>
              <div><strong>Cat Litter:</strong> $15-30/month</div>
              <div><strong>Toys & Treats:</strong> $20-50/month</div>
              <div><strong>Grooming:</strong> $30-90/month</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl p-4 md:p-6 border border-amber-200">
            <h3 className="text-base md:text-lg font-bold text-amber-900 mb-2 md:mb-3">💡 Money-Saving Tips</h3>
            <ul className="space-y-1 text-xs md:text-sm text-amber-800">
              <li>• Adopt from shelters ($50-300)</li>
              <li>• Preventive care saves money</li>
              <li>• Buy quality food in bulk</li>
              <li>• Compare vet prices</li>
              <li>• Consider pet insurance</li>
              <li>• Learn basic grooming</li>
            </ul>
          </div>

          <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-4 md:p-6 border border-red-200">
            <h3 className="text-base md:text-lg font-bold text-red-900 mb-2 md:mb-3">🛡️ Pet Insurance</h3>
            <div className="space-y-1 text-xs md:text-sm text-red-800">
              <div><strong>Monthly Cost:</strong> $20-70</div>
              <div><strong>Coverage:</strong> 70-90% of bills</div>
              <div><strong>Best For:</strong> Young, healthy pets</div>
              <div><strong>Saves:</strong> Thousands on emergencies</div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-cyan-50 to-sky-50 rounded-xl p-4 md:p-6 border border-cyan-200">
            <h3 className="text-base md:text-lg font-bold text-cyan-900 mb-2 md:mb-3">💰 First Year Costs</h3>
            <div className="space-y-1 text-xs md:text-sm text-cyan-800">
              <div><strong>Adoption:</strong> $50-3,000</div>
              <div><strong>Initial Supplies:</strong> $200-500</div>
              <div><strong>Spay/Neuter:</strong> $200-800</div>
              <div><strong>Vaccinations:</strong> $100-300</div>
              <div><strong>Microchip:</strong> $45-75</div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="mt-8">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">Related Finance Calculators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {relatedCalculators.map((calc) => (
            <Link
              key={calc.href}
              href={calc.href}
              className={`${calc.color} text-white rounded-xl p-6 hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-bold mb-2">{calc.title}</h3>
              <p className="text-sm opacity-90">{calc.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="pet-cost-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
