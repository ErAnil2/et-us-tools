'use client';

import { useState, useEffect } from 'react';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface DestinyInterpretation {
  title: string;
  description: string;
  talents: string;
  purpose: string;
}

interface LetterBreakdown {
  letter: string;
  value: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Destiny Number Calculator?",
    answer: "A Destiny Number Calculator is a free online tool designed to help you quickly and accurately calculate destiny number-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Destiny Number Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Destiny Number Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Destiny Number Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function DestinyNumberCalculatorClient() {
  const [name, setName] = useState('John Michael Smith');
  const [method, setMethod] = useState('pythagorean');
  const [destinyNumber, setDestinyNumber] = useState<number | null>(null);
  const [interpretation, setInterpretation] = useState<DestinyInterpretation | null>(null);
  const [breakdown, setBreakdown] = useState<LetterBreakdown[]>([]);
  const [total, setTotal] = useState(0);

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

  const getDestinyInterpretation = (number: number): DestinyInterpretation => {
    const interpretations: { [key: number]: DestinyInterpretation } = {
      1: {
        title: 'Leadership and Pioneering',
        description: 'You are meant to be a leader and innovator. Your destiny involves breaking new ground, being independent, and inspiring others with your originality and courage.',
        talents: 'Leadership, Innovation, Independence, Courage',
        purpose: 'To lead others and pioneer new ideas'
      },
      2: {
        title: 'Cooperation and Diplomacy',
        description: 'You are meant to bring peace and harmony. Your destiny involves mediating, cooperating, and creating balance in relationships and situations.',
        talents: 'Diplomacy, Cooperation, Sensitivity, Partnership',
        purpose: 'To bring people together and create harmony'
      },
      3: {
        title: 'Creativity and Communication',
        description: 'You are meant to inspire and express. Your destiny involves creative self-expression, communication, and bringing joy and beauty into the world.',
        talents: 'Creativity, Communication, Expression, Optimism',
        purpose: 'To inspire others through creative expression'
      },
      4: {
        title: 'Building and Organization',
        description: 'You are meant to create lasting structures. Your destiny involves building, organizing, and creating solid foundations for yourself and others.',
        talents: 'Organization, Discipline, Practicality, Reliability',
        purpose: 'To build something lasting and meaningful'
      },
      5: {
        title: 'Freedom and Adventure',
        description: 'You are meant to explore and experience variety. Your destiny involves embracing change, seeking freedom, and helping others adapt to new experiences.',
        talents: 'Adaptability, Adventure, Freedom, Versatility',
        purpose: 'To experience life fully and help others embrace change'
      },
      6: {
        title: 'Nurturing and Healing',
        description: 'You are meant to care for and heal others. Your destiny involves service, responsibility, and creating harmony in home and community.',
        talents: 'Nurturing, Healing, Responsibility, Harmony',
        purpose: 'To care for others and create beautiful environments'
      },
      7: {
        title: 'Analysis and Spirituality',
        description: 'You are meant to seek truth and wisdom. Your destiny involves deep analysis, spiritual development, and sharing knowledge with others.',
        talents: 'Analysis, Intuition, Wisdom, Spirituality',
        purpose: 'To seek truth and share spiritual wisdom'
      },
      8: {
        title: 'Achievement and Success',
        description: 'You are meant to master material success. Your destiny involves business, organization, and achieving great things while maintaining integrity.',
        talents: 'Business Acumen, Organization, Power, Achievement',
        purpose: 'To achieve material success and empower others'
      },
      9: {
        title: 'Service and Compassion',
        description: 'You are meant to serve humanity. Your destiny involves compassion, idealism, and working for the greater good of all.',
        talents: 'Compassion, Idealism, Artistry, Global Thinking',
        purpose: 'To serve humanity and make the world better'
      },
      11: {
        title: 'Inspiration and Intuition',
        description: 'You are meant to inspire others spiritually. Your destiny involves heightened intuition, spiritual leadership, and illuminating the path for others.',
        talents: 'Intuition, Inspiration, Spirituality, Vision',
        purpose: 'To inspire others through spiritual insight'
      },
      22: {
        title: 'Master Building',
        description: 'You are meant to build something grand for humanity. Your destiny involves combining practical skills with visionary ideals to create lasting change.',
        talents: 'Visionary Leadership, Practical Mastery, Organization, Power',
        purpose: 'To build something significant that benefits humanity'
      },
      33: {
        title: 'Master Teaching',
        description: 'You are meant to heal and teach through love. Your destiny involves the highest level of compassion, healing, and selfless service.',
        talents: 'Unconditional Love, Healing, Teaching, Compassion',
        purpose: 'To heal and teach through unconditional love'
      }
    };

    return interpretations[number] || interpretations[1];
  };

  const calculateDestiny = () => {
    if (!name.trim()) {
      alert('Please enter your full birth name');
      return;
    }

    const cleanName = name.trim().toUpperCase().replace(/[^A-Z]/g, '');
    let sum = 0;
    const letterBreakdown: LetterBreakdown[] = [];

    for (let char of cleanName) {
      const value = getLetterValue(char, method);
      letterBreakdown.push({ letter: char, value });
      sum += value;
    }

    const finalNumber = reduceToSingleDigit(sum);

    setDestinyNumber(finalNumber);
    setInterpretation(getDestinyInterpretation(finalNumber));
    setBreakdown(letterBreakdown);
    setTotal(sum);
  };

  useEffect(() => {
    calculateDestiny();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">Destiny Number Calculator</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Discover your life's work and natural talents through your Destiny Number</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Calculate Your Destiny Number</h2>

              <div className="space-y-4">
                <p className="text-sm text-gray-600">Your Destiny Number reveals your life's work, talents, and goals. It's calculated from your full birth name.</p>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Birth Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="Enter your complete birth name"
                  />
                  <p className="text-xs text-gray-500 mt-1">Include middle names and suffixes as they appear on your birth certificate</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Calculation Method</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  >
                    <option value="pythagorean">Pythagorean (A=1, B=2, C=3...)</option>
                    <option value="chaldean">Chaldean (Ancient method)</option>
                  </select>
                </div>

                <button
                  onClick={calculateDestiny}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md"
                >
                  Calculate Destiny Number
                </button>
              </div>
            </div>

            {/* Results Section */}
            {destinyNumber && interpretation && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Destiny Number</h3>

                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                  <div className="text-6xl font-bold text-green-600 mb-2">{destinyNumber}</div>
                  <div className="text-2xl font-semibold text-gray-800">{interpretation.title}</div>
                  <div className="text-gray-600">{name}</div>
                </div>

                <div className="bg-green-50 rounded-lg p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                  <h4 className="text-lg font-semibold text-green-900 mb-3">Your Life's Work</h4>
                  <p className="text-green-800 mb-4">{interpretation.description}</p>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div>
                      <h5 className="font-semibold text-green-800 mb-2">Natural Talents</h5>
                      <p className="text-sm text-green-700">{interpretation.talents}</p>
                    </div>
                    <div>
                      <h5 className="font-semibold text-green-800 mb-2">Life Purpose</h5>
                      <p className="text-sm text-green-700">{interpretation.purpose}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h5 className="font-semibold text-gray-800 mb-3">Name Breakdown ({method})</h5>
                  <div className="grid grid-cols-6 md:grid-cols-10 gap-2 text-center text-sm mb-3">
                    {breakdown.map((item, index) => (
                      <div key={index} className="border rounded p-1 bg-white">
                        <div className="font-semibold">{item.letter}</div>
                        <div className="text-xs text-gray-600">{item.value}</div>
                      </div>
                    ))}
                  </div>
                  <div className="text-center">
                    <strong>Total: {total} → {destinyNumber}</strong>
                  </div>
                </div>
              </div>
            )}

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">What is a Destiny Number?</h3>
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>Your Destiny Number, also known as the Expression Number, reveals your natural talents, abilities, and the path you're meant to follow in life. It shows what you're capable of achieving and the purpose you're here to fulfill.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">How It's Calculated:</h4>
                <p>The Destiny Number is calculated by converting all the letters in your full birth name to numbers (based on the Pythagorean or Chaldean system), adding them together, and reducing to a single digit or master number.</p>

                <div className="bg-green-50 rounded-lg p-4 my-4">
                  <h5 className="font-semibold text-green-900 mb-2">Pythagorean System:</h5>
                  <div className="text-sm text-green-800 space-y-1">
                    <p>A=1, B=2, C=3, D=4, E=5, F=6, G=7, H=8, I=9</p>
                    <p>J=1, K=2, L=3, M=4, N=5, O=6, P=7, Q=8, R=9</p>
                    <p>S=1, T=2, U=3, V=4, W=5, X=6, Y=7, Z=8</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Why Use Your Birth Name?</h4>
                <p>Your birth name carries the vibration you were given at birth. Even if you've changed your name or go by a nickname, your birth name holds your true destiny and life purpose. A current name can show additional influences, but your birth name reveals your core destiny.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">What Your Destiny Number Reveals:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Your natural talents and abilities</li>
                  <li>The work you're meant to do</li>
                  <li>Your life's purpose and mission</li>
                  <li>The tools you have to achieve your goals</li>
                  <li>How you can best serve the world</li>
                </ul>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Destiny vs. Life Path:</h4>
                <p>While your Life Path number shows the journey you're on, your Destiny Number reveals what you're meant to accomplish along that journey. They work together to create your complete numerological blueprint.</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Destiny Numbers */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Destiny Numbers</h3>
              <div className="space-y-2 text-sm">
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">1:</strong>
                  <p className="text-gray-600">Leadership & Innovation</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">2:</strong>
                  <p className="text-gray-600">Cooperation & Diplomacy</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">3:</strong>
                  <p className="text-gray-600">Creativity & Expression</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">4:</strong>
                  <p className="text-gray-600">Building & Organization</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">5:</strong>
                  <p className="text-gray-600">Freedom & Adventure</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">6:</strong>
                  <p className="text-gray-600">Nurturing & Service</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">7:</strong>
                  <p className="text-gray-600">Analysis & Spirituality</p>
                </div>
                <div className="border-l-3 border-indigo-500 pl-3">
                  <strong className="text-indigo-700">8:</strong>
                  <p className="text-gray-600">Achievement & Power</p>
                </div>
                <div className="border-l-3 border-purple-500 pl-3">
                  <strong className="text-purple-700">9:</strong>
                  <p className="text-gray-600">Humanitarianism & Compassion</p>
                </div>
              </div>
            </div>

            {/* Master Numbers */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Master Destinies</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">11:</strong>
                  <p className="text-gray-600">Inspire others through spiritual insight and intuition</p>
                </div>
                <div>
                  <strong className="text-indigo-700">22:</strong>
                  <p className="text-gray-600">Build something grand and lasting for humanity</p>
                </div>
                <div>
                  <strong className="text-purple-700">33:</strong>
                  <p className="text-gray-600">Heal and teach through unconditional love</p>
                </div>
              </div>
            </div>

            {/* Calculation Methods */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Which Method?</h3>
              <div className="space-y-3 text-sm text-gray-700">
                <div>
                  <strong className="text-purple-700">Pythagorean:</strong>
                  <p>Most widely used in Western numerology. Simple A-Z = 1-9 pattern.</p>
                </div>
                <div>
                  <strong className="text-indigo-700">Chaldean:</strong>
                  <p>Ancient Babylonian system. Each letter has unique spiritual vibration.</p>
                </div>
                <p className="text-xs italic">Both methods are valid. Try both to see which resonates with you.</p>
              </div>
            </div>

            {/* Important Tips */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Important Tips</h3>
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
                  <span>Don't use nicknames or married names</span>
                </li>
                <li className="flex items-start">
                  <span className="text-purple-600 mr-2">•</span>
                  <span>Master numbers are not reduced</span>
                </li>
              </ul>
            </div>

            {/* Did You Know */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg shadow-sm border border-green-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-green-900 mb-4">Did You Know?</h3>
              <p className="text-sm text-gray-700">If you legally change your name, you'll have two Destiny Numbers. Your birth name shows your natural talents, while your current name shows how you're choosing to express those talents.</p>
            </div>
          </aside>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="destiny-number-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
