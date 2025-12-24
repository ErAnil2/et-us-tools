'use client';

import { useState, useEffect } from 'react';
import RelatedCalculatorCards from '@/components/RelatedCalculatorCards';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500' },
  { href: '/us/tools/calculators/bmi-calculator', title: 'BMI Calculator', description: 'Calculate body mass index', color: 'bg-purple-500' },
  { href: '/us/tools/calculators/age-calculator', title: 'Age Calculator', description: 'Calculate your exact age', color: 'bg-orange-500' },
];

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface DogAgeClientProps {
  relatedCalculators: Array<{
    href: string;
    title: string;
    description: string;
  }>;
}

type DogSize = 'small' | 'medium' | 'large' | 'giant';
type CalcMethod = 'scientific' | 'traditional';

interface AgingRates {
  small: number;
  medium: number;
  large: number;
  giant: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Dog Age Calculator?",
    answer: "A Dog Age Calculator helps you calculate dates, times, or durations quickly. Whether you need to find the difference between dates or calculate future/past dates, this tool provides instant results.",
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

export default function DogAgeClient({ relatedCalculators = defaultRelatedCalculators }: DogAgeClientProps) {
  const { getH1, getSubHeading } = usePageSEO('dog-age-calculator');

  const [dogYears, setDogYears] = useState<number>(5);
  const [dogMonths, setDogMonths] = useState<number>(0);
  const [dogSize, setDogSize] = useState<DogSize>('medium');
  const [calcMethod, setCalcMethod] = useState<CalcMethod>('scientific');

  const [humanAge, setHumanAge] = useState<number>(36);
  const [lifeStage, setLifeStage] = useState<string>('Adult');
  const [lifeStageInfo, setLifeStageInfo] = useState<string>('');
  const [nextBirthdayHumanAge, setNextBirthdayHumanAge] = useState<number>(43);
  const [ageMilestones, setAgeMilestones] = useState<string[]>([]);

  // Age conversion rates by size (years after age 2)
  const agingRates: AgingRates = {
    small: 4,   // Small dogs age ~4 human years per dog year
    medium: 5,  // Medium dogs age ~5 human years per dog year
    large: 6,   // Large dogs age ~6 human years per dog year
    giant: 7    // Giant dogs age ~7 human years per dog year
  };

  // Breed examples by size
  const breedExamples: Record<DogSize, string> = {
    small: 'Chihuahua, Yorkshire Terrier, Pomeranian, Maltese, Pug',
    medium: 'Border Collie, Cocker Spaniel, Australian Shepherd, Bulldog',
    large: 'Labrador, German Shepherd, Golden Retriever, Rottweiler',
    giant: 'Great Dane, Saint Bernard, Mastiff, Irish Wolfhound'
  };

  const getWeightRange = (size: DogSize): string => {
    switch(size) {
      case 'small': return '(under 20 lbs)';
      case 'medium': return '(20-50 lbs)';
      case 'large': return '(50-90 lbs)';
      case 'giant': return '(over 90 lbs)';
      default: return '';
    }
  };

  const getSeniorAge = (size: DogSize): number => {
    switch(size) {
      case 'small': return 8;
      case 'medium': return 7;
      case 'large': return 6;
      case 'giant': return 5;
      default: return 7;
    }
  };

  const generateAgeMilestones = (
    size: DogSize,
    method: CalcMethod,
    currentAge: number,
    currentHumanAge: number
  ): string[] => {
    const milestones: string[] = [];

    if (method === 'scientific') {
      milestones.push('• 1 year = 15 human years (adolescent)');
      milestones.push('• 2 years = 24 human years (young adult)');

      const yearlyRate = agingRates[size];
      const seniorAge = getSeniorAge(size);

      // Add current age milestone
      const stage = currentAge < 1 ? 'puppy' :
                    currentAge < 3 ? 'young adult' :
                    currentAge < seniorAge ? 'adult' : 'senior';
      milestones.push(`• ${Math.floor(currentAge)} years = ${currentHumanAge} human years (${stage}) ← Current`);

      // Add senior milestone if not there yet
      if (currentAge < seniorAge) {
        const seniorHumanAge = 24 + (seniorAge - 2) * yearlyRate;
        milestones.push(`• ${seniorAge} years = ${seniorHumanAge} human years (senior)`);
      }
    } else {
      // Traditional method
      for (let i = 1; i <= Math.max(10, Math.ceil(currentAge)); i++) {
        const humanEquiv = i * 7;
        const isCurrent = i === Math.floor(currentAge) ? ' ← Current' : '';
        milestones.push(`• ${i} year${i > 1 ? 's' : ''} = ${humanEquiv} human years${isCurrent}`);
        if (milestones.length >= 6) break; // Limit display
      }
    }

    return milestones;
  };

  useEffect(() => {
    const totalAgeInMonths = dogYears * 12 + dogMonths;
    const totalAgeInYears = totalAgeInMonths / 12;

    if (totalAgeInYears <= 0) {
      setHumanAge(0);
      setLifeStage('Puppy');
      setLifeStageInfo('Enter your dog\'s age to see life stage information');
      setNextBirthdayHumanAge(0);
      setAgeMilestones([]);
      return;
    }

    let calculatedHumanAge: number;

    if (calcMethod === 'traditional') {
      // Simple 7:1 ratio
      calculatedHumanAge = Math.round(totalAgeInYears * 7);
    } else {
      // Scientific method (AVMA)
      if (totalAgeInYears <= 1) {
        // First year = 15 human years
        calculatedHumanAge = Math.round(totalAgeInYears * 15);
      } else if (totalAgeInYears <= 2) {
        // Second year = 9 additional human years
        calculatedHumanAge = 15 + Math.round((totalAgeInYears - 1) * 9);
      } else {
        // Each subsequent year varies by size
        const yearsAfterTwo = totalAgeInYears - 2;
        const yearlyRate = agingRates[dogSize];
        calculatedHumanAge = 24 + Math.round(yearsAfterTwo * yearlyRate);
      }
    }

    // Determine life stage
    let stage: string, stageInfo: string;
    const seniorAge = getSeniorAge(dogSize);

    if (totalAgeInYears < 1) {
      stage = 'Puppy';
      stageInfo = 'Your dog is in the puppy stage - high energy, rapid growth, and learning.';
    } else if (totalAgeInYears < 3) {
      stage = 'Young Adult';
      stageInfo = 'Your dog is a young adult - active, playful, and reaching physical maturity.';
    } else if (totalAgeInYears < seniorAge) {
      stage = 'Adult';
      stageInfo = 'Your dog is in their prime adult years - active and healthy.';
    } else {
      stage = 'Senior';
      stageInfo = 'Your dog is a senior - may need adjusted diet, exercise, and more frequent vet visits.';
    }

    // Calculate next birthday in human years
    const nextBirthdayDogAge = Math.floor(totalAgeInYears) + 1;
    let nextBirthday: number;

    if (calcMethod === 'traditional') {
      nextBirthday = nextBirthdayDogAge * 7;
    } else {
      if (nextBirthdayDogAge <= 1) {
        nextBirthday = 15;
      } else if (nextBirthdayDogAge <= 2) {
        nextBirthday = 24;
      } else {
        const yearsAfterTwo = nextBirthdayDogAge - 2;
        const yearlyRate = agingRates[dogSize];
        nextBirthday = 24 + (yearsAfterTwo * yearlyRate);
      }
    }

    setHumanAge(calculatedHumanAge);
    setLifeStage(stage);
    setLifeStageInfo(stageInfo);
    setNextBirthdayHumanAge(nextBirthday);
    setAgeMilestones(generateAgeMilestones(dogSize, calcMethod, totalAgeInYears, calculatedHumanAge));
  }, [dogYears, dogMonths, dogSize, calcMethod, agingRates]);

  const sizeLabel = dogSize.charAt(0).toUpperCase() + dogSize.slice(1);

  return (
    <div className="max-w-[1180px] mx-auto px-2 py-4 sm:py-6 md:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-6 md:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{getH1('Dog Age Calculator')}</h1>
        <p className="text-lg text-gray-600">Convert your dog&apos;s age to human years with breed-specific calculations</p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Calculator Card */}
      <div className="bg-white rounded-xl shadow-lg p-3 sm:p-5 md:p-8 mb-4 sm:mb-6 md:mb-8">
        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Input Section */}
          <div className="space-y-3 sm:space-y-4 md:space-y-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Dog Information</h2>

            {/* Dog's Current Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dog&apos;s Current Age</label>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <input
                    type="number"
                    min="0"
                    max="30"
                    placeholder="Years"
                    value={dogYears}
                    onChange={(e) => setDogYears(Math.max(0, Math.min(30, parseInt(e.target.value) || 0)))}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="block text-xs text-gray-500 mt-1">Years</label>
                </div>
                <div>
                  <input
                    type="number"
                    min="0"
                    max="11"
                    placeholder="Months"
                    value={dogMonths}
                    onChange={(e) => setDogMonths(Math.max(0, Math.min(11, parseInt(e.target.value) || 0)))}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <label className="block text-xs text-gray-500 mt-1">Months</label>
                </div>
              </div>
            </div>

            {/* Dog Size Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Dog Size Category</label>
              <select
                value={dogSize}
                onChange={(e) => setDogSize(e.target.value as DogSize)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="small">Small (under 20 lbs)</option>
                <option value="medium">Medium (20-50 lbs)</option>
                <option value="large">Large (50-90 lbs)</option>
                <option value="giant">Giant (over 90 lbs)</option>
              </select>
            </div>

            {/* Popular Breeds by Size */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">Popular Breeds by Size</h4>
              <div className="text-blue-700 text-sm">
                <div><strong>{sizeLabel} Dogs {getWeightRange(dogSize)}:</strong></div>
                <div>{breedExamples[dogSize]}</div>
              </div>
            </div>

            {/* Calculation Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
              <select
                value={calcMethod}
                onChange={(e) => setCalcMethod(e.target.value as CalcMethod)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="scientific">Scientific Method (AVMA)</option>
                <option value="traditional">Traditional (7:1 ratio)</option>
              </select>
            </div>

            {/* Life Stage Information */}
            <div className="bg-green-50 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">Life Stage</h4>
              <div className="text-green-700 text-sm">
                <div><strong>{lifeStage}:</strong> {lifeStageInfo}</div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-gray-50 rounded-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Age Conversion Results</h3>

            <div className="space-y-4">
              <div className="bg-purple-100 rounded-lg p-4 text-center">
                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-600">{humanAge}</div>
                <div className="text-purple-700">Human Years</div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Dog&apos;s Age:</span>
                  <span className="font-semibold">{dogYears} years {dogMonths} months</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Size Category:</span>
                  <span className="font-semibold">{sizeLabel}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Life Stage:</span>
                  <span className="font-semibold text-blue-600">{lifeStage}</span>
                </div>

                <div className="flex justify-between items-center py-2 border-b border-gray-200">
                  <span className="text-gray-600">Method Used:</span>
                  <span className="font-semibold">
                    {calcMethod === 'scientific' ? 'Scientific (AVMA)' : 'Traditional (7:1)'}
                  </span>
                </div>

                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Next Birthday:</span>
                  <span className="font-semibold text-green-600">{nextBirthdayHumanAge} human years</span>
                </div>
              </div>
            </div>

            {/* Age Timeline */}
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
              <h4 className="font-semibold text-yellow-800 mb-3">Age Milestones</h4>
              <div className="text-yellow-700 space-y-1 text-sm">
                {ageMilestones.map((milestone, index) => (
                  <div key={index}>{milestone}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

      {/* Information Section */}
      <div className="bg-purple-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-purple-800 mb-4">Understanding Dog Years</h3>
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 text-purple-700">
          <div>
            <h4 className="font-semibold mb-2">Scientific vs Traditional:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Traditional:</strong> Simple 7:1 ratio</li>
              <li>• <strong>Scientific:</strong> Accounts for rapid early development</li>
              <li>• <strong>First year:</strong> = ~15 human years</li>
              <li>• <strong>Second year:</strong> = ~9 additional human years</li>
              <li>• <strong>Each year after:</strong> = 4-7 human years (varies by size)</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-2">Size Impact on Aging:</h4>
            <ul className="space-y-1 text-sm">
              <li>• <strong>Small dogs:</strong> Age slower, live longer</li>
              <li>• <strong>Medium dogs:</strong> Average aging rate</li>
              <li>• <strong>Large dogs:</strong> Age faster, shorter lifespan</li>
              <li>• <strong>Giant dogs:</strong> Age fastest, shortest lifespan</li>
              <li>• <strong>Size affects:</strong> Senior age threshold</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Life Stages Section */}
      <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
        <h3 className="text-xl font-semibold text-yellow-800 mb-4">Dog Life Stages &amp; Care</h3>
        <div className="grid md:grid-cols-4 gap-4 text-yellow-700">
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Puppy (0-1 year)</h4>
            <ul className="text-sm space-y-1">
              <li>• High energy &amp; growth</li>
              <li>• Training &amp; socialization</li>
              <li>• Frequent vet visits</li>
              <li>• Puppy food required</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Young Adult (1-3 years)</h4>
            <ul className="text-sm space-y-1">
              <li>• Peak physical condition</li>
              <li>• Adult food transition</li>
              <li>• Behavioral maturity</li>
              <li>• Annual checkups</li>
            </ul>
          </div>
<div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Adult (3-7 years)</h4>
            <ul className="text-sm space-y-1">
              <li>• Stable energy levels</li>
              <li>• Established routine</li>
              <li>• Regular exercise needs</li>
              <li>• Preventive healthcare</li>
            </ul>
          </div>
          <div className="bg-white rounded p-4">
            <h4 className="font-semibold mb-2">Senior (7+ years)</h4>
            <ul className="text-sm space-y-1">
              <li>• Slower, gentler exercise</li>
              <li>• Senior diet considerations</li>
              <li>• More frequent vet checks</li>
              <li>• Joint &amp; health monitoring</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="dog-age-calculator" fallbackFaqs={fallbackFaqs} />
      </div>

      <RelatedCalculatorCards calculators={relatedCalculators} />
    </div>
  );
}
