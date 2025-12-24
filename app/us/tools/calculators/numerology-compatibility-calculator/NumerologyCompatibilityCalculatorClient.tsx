'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface CompatibilityResult {
  score: number;
  description: string;
  strengths: string;
  challenges: string;
}

interface LifePathInterpretation {
  title: string;
  traits: string;
}

// Compatibility matrix data
const compatibilityMatrix: { [key: number]: { [key: number]: number } } = {
  1: { 1: 75, 2: 85, 3: 90, 4: 70, 5: 95, 6: 80, 7: 65, 8: 80, 9: 85, 11: 80, 22: 75, 33: 70 },
  2: { 1: 85, 2: 70, 3: 85, 4: 90, 5: 75, 6: 95, 7: 80, 8: 85, 9: 80, 11: 90, 22: 85, 33: 95 },
  3: { 1: 90, 2: 85, 3: 80, 4: 65, 5: 95, 6: 80, 7: 85, 8: 70, 9: 90, 11: 85, 22: 75, 33: 85 },
  4: { 1: 70, 2: 90, 3: 65, 4: 80, 5: 60, 6: 85, 7: 75, 8: 95, 9: 70, 11: 75, 22: 95, 33: 80 },
  5: { 1: 95, 2: 75, 3: 95, 4: 60, 5: 85, 6: 70, 7: 90, 8: 75, 9: 85, 11: 85, 22: 70, 33: 75 },
  6: { 1: 80, 2: 95, 3: 80, 4: 85, 5: 70, 6: 85, 7: 75, 8: 80, 9: 95, 11: 85, 22: 85, 33: 95 },
  7: { 1: 65, 2: 80, 3: 85, 4: 75, 5: 90, 6: 75, 7: 80, 8: 70, 9: 85, 11: 95, 22: 80, 33: 90 },
  8: { 1: 80, 2: 85, 3: 70, 4: 95, 5: 75, 6: 80, 7: 70, 8: 85, 9: 75, 11: 75, 22: 90, 33: 80 },
  9: { 1: 85, 2: 80, 3: 90, 4: 70, 5: 85, 6: 95, 7: 85, 8: 75, 9: 80, 11: 85, 22: 80, 33: 95 }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Numerology Compatibility Calculator?",
    answer: "A Numerology Compatibility Calculator is a free online tool designed to help you quickly and accurately calculate numerology compatibility-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Numerology Compatibility Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Numerology Compatibility Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Numerology Compatibility Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function NumerologyCompatibilityCalculatorClient() {
  const { getH1, getSubHeading } = usePageSEO('numerology-compatibility-calculator');

  const [person1LifePath, setPerson1LifePath] = useState<string>('3');
  const [person2LifePath, setPerson2LifePath] = useState<string>('5');
  const [person1Birth, setPerson1Birth] = useState<string>('');
  const [person2Birth, setPerson2Birth] = useState<string>('');
  const [results, setResults] = useState<CompatibilityResult | null>(null);

  // Helper function to reduce to single digit
  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num; // Master numbers

    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      if (num === 11 || num === 22 || num === 33) break; // Master numbers
    }

    return num;
  };

  // Calculate Life Path Number
  const calculateLifePathNumber = (month: number, day: number, year: number): number => {
    const monthReduced = reduceToSingleDigit(month);
    const dayReduced = reduceToSingleDigit(day);
    const yearReduced = reduceToSingleDigit(year);

    return reduceToSingleDigit(monthReduced + dayReduced + yearReduced);
  };

  // Get compatibility description
  const getCompatibilityDescription = (num1: number, num2: number, score: number): string => {
    if (score >= 90) {
      return 'Excellent compatibility! Your numbers harmonize beautifully and support each other\'s growth. This is a naturally flowing relationship with great potential.';
    } else if (score >= 80) {
      return 'Very good compatibility! You share similar values and can build a strong relationship. Minor adjustments may be needed, but overall harmony is strong.';
    } else if (score >= 70) {
      return 'Good compatibility with some challenges. Understanding each other\'s differences is key. With effort and communication, this relationship can thrive.';
    } else if (score >= 60) {
      return 'Moderate compatibility. You may need to work harder to understand each other. Focus on complementary strengths and be patient with differences.';
    } else {
      return 'Challenging compatibility. Your life paths may conflict, but growth is possible through understanding. This relationship will require significant effort and compromise.';
    }
  };

  // Get compatibility strengths
  const getCompatibilityStrengths = (num1: number, num2: number): string => {
    const strengths: { [key: string]: string } = {
      '1-1': 'Shared independence and drive',
      '1-2': 'Leadership balanced with cooperation',
      '1-3': 'Action meets creativity',
      '1-5': 'Adventure and freedom loving',
      '2-2': 'Deep understanding and sensitivity',
      '2-6': 'Natural nurturing and harmony',
      '3-3': 'Creative expression and joy',
      '3-5': 'Fun, variety, and excitement',
      '4-4': 'Stability and shared values',
      '4-8': 'Building success together',
      '5-5': 'Freedom and adventure',
      '6-6': 'Mutual care and responsibility',
      '6-9': 'Service and compassion',
      '7-7': 'Spiritual and intellectual connection',
      '8-8': 'Shared ambition and goals',
      '9-9': 'Humanitarian ideals'
    };
    const key = `${Math.min(num1, num2)}-${Math.max(num1, num2)}`;
    return strengths[key] || 'Complementary differences can create balance';
  };

  // Get compatibility challenges
  const getCompatibilityChallenges = (num1: number, num2: number): string => {
    const challenges: { [key: string]: string } = {
      '1-8': 'Power struggles may arise',
      '4-5': 'Stability vs freedom conflict',
      '7-8': 'Spiritual vs material values',
      '1-4': 'Impatience vs caution',
      '3-4': 'Spontaneity vs planning',
      '5-6': 'Freedom vs responsibility'
    };
    const key = `${Math.min(num1, num2)}-${Math.max(num1, num2)}`;
    return challenges[key] || 'Different approaches can be learning opportunities';
  };

  // Get numerology compatibility
  const getNumerologyCompatibility = (num1: number, num2: number): CompatibilityResult => {
    // Handle master numbers
    const matrix = compatibilityMatrix[num1 > 9 ? Math.floor(num1/11) + 1 : num1] || compatibilityMatrix[1];
    const score = matrix[num2 > 9 ? Math.floor(num2/11) + 1 : num2] || matrix[1];

    return {
      score,
      description: getCompatibilityDescription(num1, num2, score),
      strengths: getCompatibilityStrengths(num1, num2),
      challenges: getCompatibilityChallenges(num1, num2)
    };
  };

  // Get Life Path interpretation
  const getLifePathInterpretation = (number: number): LifePathInterpretation => {
    const interpretations: { [key: number]: LifePathInterpretation } = {
      1: { title: 'The Leader', traits: 'Independent, Creative, Original, Ambitious' },
      2: { title: 'The Peacemaker', traits: 'Diplomatic, Sensitive, Cooperative, Intuitive' },
      3: { title: 'The Communicator', traits: 'Creative, Expressive, Optimistic, Social' },
      4: { title: 'The Builder', traits: 'Practical, Reliable, Hardworking, Organized' },
      5: { title: 'The Explorer', traits: 'Adventurous, Versatile, Curious, Progressive' },
      6: { title: 'The Nurturer', traits: 'Caring, Responsible, Protective, Artistic' },
      7: { title: 'The Seeker', traits: 'Analytical, Spiritual, Intuitive, Private' },
      8: { title: 'The Achiever', traits: 'Ambitious, Organized, Efficient, Authoritative' },
      9: { title: 'The Humanitarian', traits: 'Compassionate, Generous, Idealistic, Artistic' },
      11: { title: 'The Intuitive', traits: 'Intuitive, Inspirational, Sensitive, Visionary' },
      22: { title: 'The Master Builder', traits: 'Visionary, Practical, Powerful, Disciplined' },
      33: { title: 'The Master Teacher', traits: 'Loving, Healing, Teaching, Selfless' }
    };
    return interpretations[number] || interpretations[1];
  };

  // Auto-calculate Life Path from birth dates
  const autoCalculateLifePath = () => {
    if (person1Birth) {
      const date1 = new Date(person1Birth);
      const lp1 = calculateLifePathNumber(date1.getMonth() + 1, date1.getDate(), date1.getFullYear());
      setPerson1LifePath(lp1.toString());
    }

    if (person2Birth) {
      const date2 = new Date(person2Birth);
      const lp2 = calculateLifePathNumber(date2.getMonth() + 1, date2.getDate(), date2.getFullYear());
      setPerson2LifePath(lp2.toString());
    }

    if (person1Birth || person2Birth) {
      alert('Life Path numbers calculated! Now click "Calculate Compatibility"');
    }
  };

  // Calculate compatibility
  const calculateNumerologyCompatibility = () => {
    const lifePath1 = parseInt(person1LifePath);
    const lifePath2 = parseInt(person2LifePath);

    if (!lifePath1 || !lifePath2) {
      alert('Please enter both Life Path numbers');
      return;
    }

    const compatibility = getNumerologyCompatibility(lifePath1, lifePath2);
    setResults(compatibility);
  };

  // Auto-calculate on load with default values
  useEffect(() => {
    calculateNumerologyCompatibility();
  }, []);

  const lifePath1 = parseInt(person1LifePath) || 1;
  const lifePath2 = parseInt(person2LifePath) || 1;
  const interpretation1 = getLifePathInterpretation(lifePath1);
  const interpretation2 = getLifePathInterpretation(lifePath2);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Numerology Compatibility Calculator')}</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Discover relationship compatibility based on Life Path numbers</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Calculate Numerology Compatibility</h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium mb-3 text-gray-900">Person 1</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Life Path Number</label>
                        <input
                          type="number"
                          value={person1LifePath}
                          onChange={(e) => setPerson1LifePath(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          min="1"
                          max="33"
                          placeholder="1-9, 11, 22, 33"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date (Optional)</label>
                        <input
                          type="date"
                          value={person1Birth}
                          onChange={(e) => setPerson1Birth(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-md p-4">
                    <h4 className="font-medium mb-3 text-gray-900">Person 2</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Life Path Number</label>
                        <input
                          type="number"
                          value={person2LifePath}
                          onChange={(e) => setPerson2LifePath(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                          min="1"
                          max="33"
                          placeholder="1-9, 11, 22, 33"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Birth Date (Optional)</label>
                        <input
                          type="date"
                          value={person2Birth}
                          onChange={(e) => setPerson2Birth(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">Don&apos;t know your Life Path number?</p>
                  <button
                    onClick={autoCalculateLifePath}
                    className="text-purple-600 hover:text-purple-700 font-semibold text-sm underline"
                  >
                    Auto-calculate from birth dates
                  </button>
                </div>

                <button
                  onClick={calculateNumerologyCompatibility}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md"
                >
                  Calculate Compatibility
                </button>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Compatibility Results</h3>
              {results && (
                <div>
                  <div className="text-center mb-3 sm:mb-4 md:mb-6">
                    <div className="text-6xl font-bold text-pink-600 mb-2">{results.score}%</div>
                    <div className="text-xl font-semibold text-gray-800">Numerology Compatibility</div>
                    <div className="text-gray-600">Life Path {lifePath1} + Life Path {lifePath2}</div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-3 sm:mb-4 md:mb-6">
                    <div className="bg-gray-200 rounded-full h-6 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full transition-all duration-1000 flex items-center justify-center text-white text-sm font-semibold"
                        style={{ width: `${results.score}%` }}
                      >
                        {results.score}%
                      </div>
                    </div>
                  </div>

                  <div className="bg-pink-50 rounded-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                    <h4 className="text-lg font-semibold text-pink-900 mb-4">Compatibility Analysis</h4>
                    <p className="text-pink-800 mb-4">{results.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                    <div className="bg-white border border-purple-200 rounded-lg p-4">
                      <h5 className="font-semibold text-purple-800 mb-2">Life Path {lifePath1}</h5>
                      <div className="text-sm text-purple-700">
                        <strong>{interpretation1.title}</strong>
                        <p className="text-gray-600 mt-1">{interpretation1.traits}</p>
                      </div>
                    </div>
<div className="bg-white border border-pink-200 rounded-lg p-4">
                      <h5 className="font-semibold text-pink-800 mb-2">Life Path {lifePath2}</h5>
                      <div className="text-sm text-pink-700">
                        <strong>{interpretation2.title}</strong>
                        <p className="text-gray-600 mt-1">{interpretation2.traits}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h5 className="font-semibold text-green-800 mb-2">Relationship Strengths</h5>
                      <p className="text-sm text-green-700">{results.strengths}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4">
                      <h5 className="font-semibold text-orange-800 mb-2">Growth Areas</h5>
                      <p className="text-sm text-orange-700">{results.challenges}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Numerology Compatibility</h3>
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>Numerology compatibility is based primarily on Life Path numbers, which reveal the core essence of each person&apos;s journey through life. When two Life Path numbers come together, they create a unique dynamic that can show the strengths and challenges of the relationship.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">How It Works:</h4>
                <p>Each Life Path number has natural affinities with certain other numbers and potential challenges with others. Our calculator analyzes the compatibility between two Life Path numbers based on their core characteristics, values, and life approaches.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Compatibility Levels:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>90-100%:</strong> Excellent compatibility - natural harmony and mutual understanding</li>
                  <li><strong>80-89%:</strong> Very good compatibility - strong potential for a successful relationship</li>
                  <li><strong>70-79%:</strong> Good compatibility - some challenges but workable with effort</li>
                  <li><strong>60-69%:</strong> Moderate compatibility - requires understanding and compromise</li>
                  <li><strong>Below 60%:</strong> Challenging compatibility - significant differences to overcome</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">What Compatibility Reveals:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Natural harmony or potential friction points</li>
                  <li>Areas of mutual understanding</li>
                  <li>Complementary strengths and weaknesses</li>
                  <li>Communication styles and how they interact</li>
                  <li>Long-term relationship potential</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Important Note:</h4>
                <p>While numerology can provide valuable insights, no compatibility system is absolute. Every relationship is unique, and factors like mutual respect, communication, and shared values are equally important. Use this calculator as a tool for understanding, not as a definitive answer.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Beyond Life Path:</h4>
                <p>For a more complete compatibility analysis, you can also compare Destiny Numbers, Soul Urge Numbers, and Personality Numbers. Each number adds another layer of understanding to the relationship dynamic.</p>
              </div>
            </div>
          </div>
          {/* End Main Content */}

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Best Matches */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow-sm border border-purple-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Highly Compatible Pairs</h3>
              <div className="space-y-2 text-sm">
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">1 & 5:</strong>
                  <p className="text-gray-600">Adventure and leadership combine</p>
                </div>
                <div className="border-l-3 border-pink-500 pl-3">
                  <strong className="text-pink-700">2 & 6:</strong>
                  <p className="text-gray-600">Nurturing and harmony flow naturally</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">3 & 5:</strong>
                  <p className="text-gray-600">Creativity and freedom unite</p>
                </div>
                <div className="border-l-3 border-pink-500 pl-3">
                  <strong className="text-pink-700">4 & 8:</strong>
                  <p className="text-gray-600">Building and achieving together</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">6 & 9:</strong>
                  <p className="text-gray-600">Compassion and service align</p>
                </div>
              </div>
            </div>

            {/* Challenging Pairs */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Growth Opportunities</h3>
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-medium text-purple-700">Some pairs require more work:</p>
                <ul className="space-y-1 pl-3">
                  <li>• 1 & 8: Power struggles possible</li>
                  <li>• 4 & 5: Structure vs. freedom</li>
                  <li>• 7 & 8: Spiritual vs. material</li>
                </ul>
                <p className="text-xs italic mt-2">These pairs can work with understanding and respect!</p>
              </div>
            </div>

            {/* Master Numbers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Master Number Pairs</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">11 + Any Number:</strong>
                  <p className="text-gray-600">Brings spiritual depth and intuition</p>
                </div>
                <div>
                  <strong className="text-indigo-700">22 + Any Number:</strong>
                  <p className="text-gray-600">Adds vision and practical mastery</p>
                </div>
                <div>
                  <strong className="text-purple-700">33 + Any Number:</strong>
                  <p className="text-gray-600">Infuses unconditional love and healing</p>
                </div>
              </div>
            </div>

            {/* Relationship Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Relationship Tips</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Focus on complementary strengths</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Accept and appreciate differences</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Communicate openly about needs</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Use challenges as growth opportunities</span>
                </li>
              </ul>
            </div>

            {/* Did You Know */}
            <div className="bg-gradient-to-br from-pink-50 to-red-50 rounded-lg shadow-sm border border-pink-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-pink-900 mb-4">Did You Know?</h3>
              <p className="text-sm text-gray-700">Relationships with &quot;challenging&quot; compatibility scores can actually be the most rewarding, as they push both partners to grow and evolve beyond their comfort zones.</p>
            </div>
          </aside>
          {/* End Sidebar */}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="numerology-compatibility-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
