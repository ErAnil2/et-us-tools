'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface LifePathInterpretation {
  title: string;
  description: string;
}

interface CompleteResults {
  fullName: string;
  birthDate: string;
  lifePathNumber: number;
  destinyNumber: number;
  soulUrgeNumber: number;
  personalityNumber: number;
  birthdayNumber: number;
  currentNameNumber: number | null;
  currentName: string;
  personalYear: number;
  personalMonth: number;
  method: string;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Complete Numerology Profile Calculator?",
    answer: "A Complete Numerology Profile Calculator is a free online tool designed to help you quickly and accurately calculate complete numerology profile-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Complete Numerology Profile Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Complete Numerology Profile Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Complete Numerology Profile Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function CompleteNumerologyProfileCalculatorClient() {
  const [fullName, setFullName] = useState('John Michael Smith');
  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [currentName, setCurrentName] = useState('');
  const [method, setMethod] = useState('pythagorean');
  const [results, setResults] = useState<CompleteResults | null>(null);

  const getLetterValue = (letter: string, calculationMethod: string): number => {
    if (calculationMethod === 'chaldean') {
      const chaldeanValues: { [key: string]: number } = {
        A: 1, B: 2, C: 3, D: 4, E: 5, F: 8, G: 3, H: 5, I: 1,
        J: 1, K: 2, L: 3, M: 4, N: 5, O: 7, P: 8, Q: 1, R: 2,
        S: 3, T: 4, U: 6, V: 6, W: 6, X: 5, Y: 1, Z: 7
      };
      return chaldeanValues[letter] || 0;
    } else {
      // Pythagorean method
      return ((letter.charCodeAt(0) - 64) % 9) || 9;
    }
  };

  const reduceToSingleDigit = (num: number): number => {
    if (num === 11 || num === 22 || num === 33) return num; // Master numbers

    while (num > 9) {
      num = num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
      if (num === 11 || num === 22 || num === 33) break; // Master numbers
    }

    return num;
  };

  const calculateLifePathNumber = (month: number, day: number, year: number): number => {
    const monthReduced = reduceToSingleDigit(month);
    const dayReduced = reduceToSingleDigit(day);
    const yearReduced = reduceToSingleDigit(year);

    return reduceToSingleDigit(monthReduced + dayReduced + yearReduced);
  };

  const calculateDestinyNumber = (name: string, calculationMethod: string): number => {
    let sum = 0;

    for (let char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      sum += getLetterValue(char, calculationMethod);
    }

    return reduceToSingleDigit(sum);
  };

  const calculateSoulUrgeNumber = (name: string, calculationMethod: string): number => {
    const vowels = 'AEIOU';
    let sum = 0;

    for (let char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      if (vowels.includes(char)) {
        sum += getLetterValue(char, calculationMethod);
      }
    }

    return reduceToSingleDigit(sum);
  };

  const calculatePersonalityNumber = (name: string, calculationMethod: string): number => {
    const vowels = 'AEIOU';
    let sum = 0;

    for (let char of name.toUpperCase().replace(/[^A-Z]/g, '')) {
      if (!vowels.includes(char)) {
        sum += getLetterValue(char, calculationMethod);
      }
    }

    return reduceToSingleDigit(sum);
  };

  const calculatePersonalYear = (birthMonth: number, birthDay: number): number => {
    const currentYear = new Date().getFullYear();
    return reduceToSingleDigit(birthMonth + birthDay + currentYear);
  };

  const calculatePersonalMonth = (personalYear: number, currentMonth: number): number => {
    return reduceToSingleDigit(personalYear + currentMonth);
  };

  const getLifePathInterpretation = (number: number): LifePathInterpretation => {
    const interpretations: { [key: number]: LifePathInterpretation } = {
      1: { title: 'The Leader', description: 'Natural-born leader with independence and pioneering spirit' },
      2: { title: 'The Peacemaker', description: 'Excel at cooperation and bringing people together' },
      3: { title: 'The Communicator', description: 'Natural creative and communication gifts' },
      4: { title: 'The Builder', description: 'Practical and hardworking, excellent at creating foundations' },
      5: { title: 'The Explorer', description: 'Crave freedom and adventure, learning through experiences' },
      6: { title: 'The Nurturer', description: 'Naturally caring and responsible, drawn to healing' },
      7: { title: 'The Seeker', description: 'Introspective and analytical, seeking deeper truths' },
      8: { title: 'The Achiever', description: 'Natural business and organizational abilities' },
      9: { title: 'The Humanitarian', description: 'Compassionate and idealistic, drawn to serve humanity' },
      11: { title: 'The Intuitive', description: 'Heightened intuition and inspiration' },
      22: { title: 'The Master Builder', description: 'Combines practical skills with visionary ideals' },
      33: { title: 'The Master Teacher', description: 'Most spiritually evolved number' }
    };
    return interpretations[number] || interpretations[1];
  };

  const getDestinyInterpretation = (number: number): string => {
    const interpretations: { [key: number]: string } = {
      1: 'Leadership and pioneering - meant to be a leader and innovator',
      2: 'Cooperation and diplomacy - meant to bring peace and harmony',
      3: 'Creativity and communication - meant to inspire and express',
      4: 'Building and organizing - meant to create lasting structures',
      5: 'Freedom and adventure - meant to explore and experience variety',
      6: 'Nurturing and healing - meant to care for and heal others',
      7: 'Analysis and spirituality - meant to seek truth and wisdom',
      8: 'Achievement and success - meant to master material success',
      9: 'Service and compassion - meant to serve humanity',
      11: 'Inspiration and intuition - meant to inspire others spiritually',
      22: 'Master building - meant to build something grand for humanity',
      33: 'Master teaching - meant to heal and teach through love'
    };
    return interpretations[number] || 'Unique path of self-discovery';
  };

  const getPersonalYearMeaning = (year: number): string => {
    const meanings: { [key: number]: string } = {
      1: 'New beginnings and fresh starts - time to plant seeds',
      2: 'Cooperation and patience - time to nurture relationships',
      3: 'Creativity and expression - time to share your talents',
      4: 'Hard work and building - time to create solid foundations',
      5: 'Freedom and change - time to embrace new experiences',
      6: 'Love and responsibility - time to focus on home and family',
      7: 'Introspection and learning - time for spiritual growth',
      8: 'Achievement and success - time to reap material rewards',
      9: 'Completion and service - time to finish projects and help others'
    };
    return meanings[year] || 'A year of unique opportunities';
  };

  const calculateCompleteNumerology = () => {
    if (!fullName.trim() || !birthDate) {
      alert('Please enter both your full name and birth date');
      return;
    }

    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const year = date.getFullYear();

    // Calculate all core numbers
    const lifePathNumber = calculateLifePathNumber(month, day, year);
    const destinyNumber = calculateDestinyNumber(fullName, method);
    const soulUrgeNumber = calculateSoulUrgeNumber(fullName, method);
    const personalityNumber = calculatePersonalityNumber(fullName, method);
    const birthdayNumber = reduceToSingleDigit(day);

    // Calculate current name number if provided
    let currentNameNumber = null;
    if (currentName.trim()) {
      currentNameNumber = calculateDestinyNumber(currentName, method);
    }

    // Calculate personal year and month
    const personalYear = calculatePersonalYear(month, day);
    const personalMonth = calculatePersonalMonth(personalYear, new Date().getMonth() + 1);

    setResults({
      fullName: fullName.trim(),
      birthDate: `${month}/${day}/${year}`,
      lifePathNumber,
      destinyNumber,
      soulUrgeNumber,
      personalityNumber,
      birthdayNumber,
      currentNameNumber,
      currentName: currentName.trim(),
      personalYear,
      personalMonth,
      method
    });
  };

  useEffect(() => {
    calculateCompleteNumerology();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Complete Numerology Profile Calculator</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Get your comprehensive numerology profile with all core numbers and insights</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Complete Numerology Profile</h2>

              <div className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="First Middle Last"
                    />
                    <p className="text-xs text-gray-500 mt-1">Use your birth name as it appears on your birth certificate</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                    <input
                      type="date"
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current/Common Name (Optional)</label>
                    <input
                      type="text"
                      value={currentName}
                      onChange={(e) => setCurrentName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="Name you commonly use"
                    />
                    <p className="text-xs text-gray-500 mt-1">For additional personality insights</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Analysis Type</label>
                    <select
                      value={method}
                      onChange={(e) => setMethod(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="standard">Standard Numerology</option>
                      <option value="pythagorean">Pythagorean Method</option>
                      <option value="chaldean">Chaldean Method</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={calculateCompleteNumerology}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md"
                >
                  Calculate Complete Profile
                </button>
              </div>
            </div>

            {/* Results Section */}
            {results && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Complete Numerology Profile</h3>

                <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                  <h4 className="text-xl font-semibold text-gray-900 mb-4">Complete Numerology Profile</h4>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div><strong>Name:</strong> {results.fullName}</div>
                    <div><strong>Birth Date:</strong> {results.birthDate}</div>
                    <div><strong>Method:</strong> {results.method}</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4 mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-blue-50 rounded-lg p-4 text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-blue-600 mb-2">{results.lifePathNumber}</div>
                    <div className="font-semibold text-blue-800">Life Path</div>
                    <div className="text-sm text-blue-700">Your life's purpose</div>
                  </div>
                  <div className="bg-green-50 rounded-lg p-4 text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-green-600 mb-2">{results.destinyNumber}</div>
                    <div className="font-semibold text-green-800">Destiny</div>
                    <div className="text-sm text-green-700">Your life's work</div>
                  </div>
                  <div className="bg-purple-50 rounded-lg p-4 text-center">
                    <div className="text-xl sm:text-2xl md:text-3xl font-bold text-purple-600 mb-2">{results.soulUrgeNumber}</div>
                    <div className="font-semibold text-purple-800">Soul Urge</div>
                    <div className="text-sm text-purple-700">Inner desires</div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-white border rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Core Numbers</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Personality Number:</span>
                        <span className="font-semibold">{results.personalityNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Birthday Number:</span>
                        <span className="font-semibold">{results.birthdayNumber}</span>
                      </div>
                      {results.currentNameNumber && (
                        <div className="flex justify-between">
                          <span>Current Name Number:</span>
                          <span className="font-semibold">{results.currentNameNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white border rounded-lg p-4">
                    <h5 className="font-semibold text-gray-800 mb-3">Current Cycles</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Personal Year:</span>
                        <span className="font-semibold">{results.personalYear}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Personal Month:</span>
                        <span className="font-semibold">{results.personalMonth}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 md:p-6">
                  <h5 className="font-semibold text-yellow-800 mb-3">Key Insights</h5>
                  <div className="space-y-3 text-sm">
                    <div><strong>Life Path {results.lifePathNumber}:</strong> {getLifePathInterpretation(results.lifePathNumber).description}</div>
                    <div><strong>Destiny {results.destinyNumber}:</strong> {getDestinyInterpretation(results.destinyNumber)}</div>
                    <div><strong>This Year ({results.personalYear}):</strong> {getPersonalYearMeaning(results.personalYear)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Complete Numerology Profile</h3>
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>Your complete numerology profile provides a comprehensive analysis of all your core numbers, revealing deep insights about your personality, life purpose, and destiny.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">What's Included:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Life Path Number:</strong> Your life's purpose and journey</li>
                  <li><strong>Destiny Number:</strong> Your life's work and talents</li>
                  <li><strong>Soul Urge Number:</strong> Your inner desires and motivations</li>
                  <li><strong>Personality Number:</strong> How others perceive you</li>
                  <li><strong>Birthday Number:</strong> Special talents and abilities</li>
                  <li><strong>Personal Year & Month:</strong> Current life cycles and timing</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">How It Works:</h4>
                <p>The complete profile combines multiple numerology calculations to give you a holistic view of your numerological blueprint. Each number is calculated using either the Pythagorean or Chaldean method, based on your selection.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Understanding Profile */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Understanding Your Profile</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <p>Your complete numerology profile is like a roadmap for your life, revealing your strengths, challenges, and opportunities.</p>
                <p>Each number provides a different perspective, working together to create a comprehensive picture of who you are.</p>
              </div>
            </div>

            {/* Core Numbers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Core Numbers</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">Life Path:</strong>
                  <p className="text-gray-600">Most important number - your life's journey</p>
                </div>
                <div>
                  <strong className="text-indigo-700">Destiny:</strong>
                  <p className="text-gray-600">Your purpose and what you're meant to do</p>
                </div>
                <div>
                  <strong className="text-purple-700">Soul Urge:</strong>
                  <p className="text-gray-600">Your heart's desire and inner motivation</p>
                </div>
                <div>
                  <strong className="text-indigo-700">Personality:</strong>
                  <p className="text-gray-600">How you present yourself to the world</p>
                </div>
              </div>
            </div>

            {/* Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Calculation Methods</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">Pythagorean:</strong>
                  <p className="text-gray-600">Most common Western method (A=1, B=2, C=3...)</p>
                </div>
                <div>
                  <strong className="text-indigo-700">Chaldean:</strong>
                  <p className="text-gray-600">Ancient Babylonian method with different letter values</p>
                </div>
              </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Tips for Best Results</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Use your full legal birth name</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Include all middle names</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Enter your exact birth date</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Read all numbers together for complete insights</span>
                </li>
              </ul>
            </div>
          </aside>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="complete-numerology-profile-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
