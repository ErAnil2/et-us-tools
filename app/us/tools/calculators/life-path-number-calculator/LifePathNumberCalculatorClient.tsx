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

interface LifePathNumberCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface Interpretation {
  title: string;
  description: string;
  traits: string;
  challenges: string;
  career: string;
}

interface Results {
  month: number;
  day: number;
  year: number;
  lifePathNumber: number;
  interpretation: Interpretation;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Life Path Number Calculator?",
    answer: "A Life Path Number Calculator is a free online tool designed to help you quickly and accurately calculate life path number-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Life Path Number Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Life Path Number Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Life Path Number Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LifePathNumberCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: LifePathNumberCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('life-path-number-calculator');

  const [birthMonth, setBirthMonth] = useState<number>(5);
  const [birthDay, setBirthDay] = useState<number>(15);
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [results, setResults] = useState<Results | null>(null);

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

  const getLifePathInterpretation = (number: number): Interpretation => {
    const interpretations: { [key: number]: Interpretation } = {
      1: {
        title: 'The Leader',
        description: 'You are a natural-born leader with strong independence and pioneering spirit. Your path involves learning to lead without dominating.',
        traits: 'Independent, Creative, Original, Ambitious',
        challenges: 'Avoid being too aggressive or egotistical',
        career: 'Entrepreneur, CEO, Inventor, Pioneer'
      },
      2: {
        title: 'The Peacemaker',
        description: 'You excel at cooperation and bringing people together. Your path involves learning to balance your own needs with others.',
        traits: 'Diplomatic, Sensitive, Cooperative, Intuitive',
        challenges: 'Avoid being overly dependent or passive',
        career: 'Counselor, Mediator, Teacher, Artist'
      },
      3: {
        title: 'The Communicator',
        description: 'You have natural creative and communication gifts. Your path involves expressing yourself authentically and inspiring others.',
        traits: 'Creative, Expressive, Optimistic, Social',
        challenges: 'Avoid scattering energy or being superficial',
        career: 'Artist, Writer, Performer, Speaker'
      },
      4: {
        title: 'The Builder',
        description: 'You are practical and hardworking, excellent at creating solid foundations. Your path involves building something lasting.',
        traits: 'Practical, Reliable, Hardworking, Organized',
        challenges: 'Avoid being too rigid or narrow-minded',
        career: 'Engineer, Accountant, Manager, Builder'
      },
      5: {
        title: 'The Explorer',
        description: 'You crave freedom and adventure, learning through diverse experiences. Your path involves embracing change constructively.',
        traits: 'Adventurous, Versatile, Curious, Progressive',
        challenges: 'Avoid restlessness or irresponsibility',
        career: 'Travel Guide, Salesperson, Journalist, Entrepreneur'
      },
      6: {
        title: 'The Nurturer',
        description: 'You are naturally caring and responsible, drawn to healing and service. Your path involves nurturing others and creating harmony.',
        traits: 'Caring, Responsible, Protective, Artistic',
        challenges: 'Avoid being overly protective or meddling',
        career: 'Teacher, Healer, Counselor, Interior Designer'
      },
      7: {
        title: 'The Seeker',
        description: 'You are naturally introspective and analytical, seeking deeper truths. Your path involves developing wisdom and spiritual understanding.',
        traits: 'Analytical, Spiritual, Intuitive, Private',
        challenges: 'Avoid being too withdrawn or critical',
        career: 'Researcher, Analyst, Spiritual Teacher, Scientist'
      },
      8: {
        title: 'The Achiever',
        description: 'You have natural business and organizational abilities. Your path involves mastering material success while maintaining integrity.',
        traits: 'Ambitious, Organized, Efficient, Authoritative',
        challenges: 'Avoid being too materialistic or dominating',
        career: 'Business Executive, Banker, Real Estate, Politics'
      },
      9: {
        title: 'The Humanitarian',
        description: 'You are compassionate and idealistic, drawn to serve humanity. Your path involves learning to give without expecting return.',
        traits: 'Compassionate, Generous, Idealistic, Artistic',
        challenges: 'Avoid being too emotional or impractical',
        career: 'Social Worker, Artist, Teacher, Philanthropist'
      },
      11: {
        title: 'The Intuitive',
        description: 'Master number 11 brings heightened intuition and inspiration. Your path involves inspiring others through spiritual insight.',
        traits: 'Intuitive, Inspirational, Sensitive, Visionary',
        challenges: 'Avoid being too sensitive or impractical',
        career: 'Spiritual Teacher, Artist, Inventor, Counselor'
      },
      22: {
        title: 'The Master Builder',
        description: 'Master number 22 combines practical skills with visionary ideals. Your path involves building something significant for humanity.',
        traits: 'Visionary, Practical, Powerful, Disciplined',
        challenges: 'Avoid being overwhelmed by your potential',
        career: 'Architect, International Business, Large Organizations'
      },
      33: {
        title: 'The Master Teacher',
        description: 'Master number 33 is the most spiritually evolved. Your path involves healing and teaching through love and compassion.',
        traits: 'Loving, Healing, Teaching, Selfless',
        challenges: 'Avoid martyrdom or emotional overwhelm',
        career: 'Spiritual Healer, Teacher, Philanthropist, Artist'
      }
    };

    return interpretations[number] || interpretations[1];
  };

  const calculateLifePath = () => {
    if (!birthMonth || !birthDay || !birthYear) {
      alert('Please enter your complete birth date');
      return;
    }

    const lifePathNumber = calculateLifePathNumber(birthMonth, birthDay, birthYear);
    const interpretation = getLifePathInterpretation(lifePathNumber);

    setResults({
      month: birthMonth,
      day: birthDay,
      year: birthYear,
      lifePathNumber,
      interpretation
    });
  };

  // Auto-calculate on page load with default values
  useEffect(() => {
    calculateLifePath();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Life Path Number Calculator')}</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Discover your life's purpose and journey through your Life Path number</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Calculate Your Life Path Number</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">Your Life Path number reveals your life's purpose, challenges, and opportunities. It's calculated from your birth date.</p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="birth-month" className="block text-sm font-medium text-gray-700 mb-2">Birth Month</label>
                    <select
                      id="birth-month"
                      value={birthMonth}
                      onChange={(e) => setBirthMonth(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="1">January (1)</option>
                      <option value="2">February (2)</option>
                      <option value="3">March (3)</option>
                      <option value="4">April (4)</option>
                      <option value="5">May (5)</option>
                      <option value="6">June (6)</option>
                      <option value="7">July (7)</option>
                      <option value="8">August (8)</option>
                      <option value="9">September (9)</option>
                      <option value="10">October (10)</option>
                      <option value="11">November (11)</option>
                      <option value="12">December (12)</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="birth-day" className="block text-sm font-medium text-gray-700 mb-2">Birth Day</label>
                    <input
                      type="number"
                      id="birth-day"
                      value={birthDay}
                      onChange={(e) => setBirthDay(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1"
                      max="31"
                    />
                  </div>

                  <div>
                    <label htmlFor="birth-year" className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                    <input
                      type="number"
                      id="birth-year"
                      value={birthYear}
                      onChange={(e) => setBirthYear(parseInt(e.target.value))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      min="1900"
                      max="2030"
                    />
                  </div>
                </div>

                <button
                  onClick={calculateLifePath}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md"
                >
                  Calculate Life Path Number
                </button>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Results Section */}
            <div id="results" className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Life Path Number</h3>
              <div id="results-content">
                {results && (
                  <>
                    <div className="text-center mb-3 sm:mb-4 md:mb-6">
                      <div className="text-6xl font-bold text-blue-600 mb-2">{results.lifePathNumber}</div>
                      <div className="text-2xl font-semibold text-gray-800">{results.interpretation.title}</div>
                      <div className="text-gray-600">Birth Date: {results.month}/{results.day}/{results.year}</div>
                    </div>

                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-3 sm:p-4 md:p-6">
                      <h4 className="text-lg font-semibold text-blue-900 mb-4">Life Path Description</h4>
                      <p className="text-blue-800 mb-4">{results.interpretation.description}</p>

                      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Key Traits</h5>
                          <p className="text-sm text-blue-700">{results.interpretation.traits}</p>

                          <h5 className="font-semibold text-blue-800 mt-4 mb-2">Career Paths</h5>
                          <p className="text-sm text-blue-700">{results.interpretation.career}</p>
                        </div>
                        <div>
                          <h5 className="font-semibold text-blue-800 mb-2">Life Challenges</h5>
                          <p className="text-sm text-blue-700">{results.interpretation.challenges}</p>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What is a Life Path Number?</h3>
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>Your Life Path number is the most important number in your numerology chart. It reveals your life's purpose, the challenges you'll face, and the opportunities that will come your way.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">How It's Calculated:</h4>
                <p>The Life Path number is derived from your full birth date. Each component (month, day, and year) is reduced to a single digit (or master number 11, 22, or 33), and then these three numbers are added together and reduced again.</p>

                <div className="bg-blue-50 rounded-lg p-4 my-4">
                  <h5 className="font-semibold text-blue-900 mb-2">Example Calculation:</h5>
                  <p className="text-sm text-blue-800">
                    Birth Date: May 15, 1990<br />
                    Month: 5 → 5<br />
                    Day: 15 → 1 + 5 = 6<br />
                    Year: 1990 → 1 + 9 + 9 + 0 = 19 → 1 + 9 = 10 → 1 + 0 = 1<br />
                    Life Path: 5 + 6 + 1 = 12 → 1 + 2 = <strong>3</strong>
                  </p>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Master Numbers:</h4>
                <p>The numbers 11, 22, and 33 are considered "master numbers" and are not reduced to a single digit. These numbers carry special spiritual significance and heightened potential.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">What Your Life Path Reveals:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your natural talents and abilities</li>
                  <li>Your life's purpose and direction</li>
                  <li>The challenges you'll need to overcome</li>
                  <li>The opportunities that will come your way</li>
                  <li>Your compatibility with others</li>
                </ul>
              </div>
            </div>
          </div>
          {/* End Main Content */}

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Life Path Numbers */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Life Path Numbers</h3>
              <div className="space-y-2 text-sm">
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">1 - The Leader:</strong>
                  <p className="text-gray-600">Independent, pioneering, ambitious</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">2 - The Peacemaker:</strong>
                  <p className="text-gray-600">Diplomatic, cooperative, sensitive</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">3 - The Communicator:</strong>
                  <p className="text-gray-600">Creative, expressive, optimistic</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">4 - The Builder:</strong>
                  <p className="text-gray-600">Practical, reliable, hardworking</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">5 - The Explorer:</strong>
                  <p className="text-gray-600">Adventurous, versatile, curious</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">6 - The Nurturer:</strong>
                  <p className="text-gray-600">Caring, responsible, protective</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">7 - The Seeker:</strong>
                  <p className="text-gray-600">Analytical, spiritual, intuitive</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">8 - The Achiever:</strong>
                  <p className="text-gray-600">Ambitious, organized, efficient</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">9 - The Humanitarian:</strong>
                  <p className="text-gray-600">Compassionate, generous, idealistic</p>
                </div>
              </div>
            </div>

            {/* Master Numbers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Master Numbers</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">11 - The Intuitive:</strong>
                  <p className="text-gray-600">Heightened spiritual awareness and intuition</p>
                </div>
                <div>
                  <strong className="text-indigo-700">22 - The Master Builder:</strong>
                  <p className="text-gray-600">Turn dreams into reality on a grand scale</p>
                </div>
                <div>
                  <strong className="text-purple-700">33 - The Master Teacher:</strong>
                  <p className="text-gray-600">Ultimate level of spiritual maturity</p>
                </div>
              </div>
            </div>
{/* Why It Matters */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Why It Matters</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Most important number in numerology</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Reveals your life's journey and purpose</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Shows natural talents and challenges</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Helps understand life lessons</span>
                </li>
              </ul>
            </div>

            {/* Did You Know */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg shadow-sm border border-blue-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">Did You Know?</h3>
              <p className="text-sm text-gray-700">Your Life Path number remains constant throughout your life, unlike other numerology numbers that can change based on your current name or circumstances.</p>
            </div>
          </aside>
          {/* End Sidebar */}
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white py-12">
        <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">Related Numerology Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="block bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 hover:shadow-md transition-shadow"
              >
                <div className={`${calc.color || 'bg-gray-500'} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    {calc.icon === 'chart' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    )}
                    {calc.icon === 'heart' && (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    )}
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{calc.title}</h3>
                <p className="text-sm text-gray-600">{calc.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="life-path-number-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
