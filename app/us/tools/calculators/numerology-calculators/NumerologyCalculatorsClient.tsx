'use client';

import Link from 'next/link';
import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { usePageSEO } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
const numerologyCalculators = [
  {
    title: 'Complete Numerology Profile',
    description: 'Get your comprehensive numerology profile with all core numbers including Life Path, Destiny, Soul Urge, Personality, and Birthday numbers.',
    href: '/us/tools/calculators/complete-numerology-profile-calculator',
    icon: '✨',
    color: 'from-purple-500 to-indigo-600',
    features: ['Life Path Number', 'Destiny Number', 'Soul Urge Number', 'Personal Year & Month']
  },
  {
    title: 'Life Path Number Calculator',
    description: 'Discover your life\'s purpose and journey. Your Life Path number is the most important number in numerology, revealing your natural talents and life mission.',
    href: '/us/tools/calculators/life-path-number-calculator',
    icon: '🛤️',
    color: 'from-blue-500 to-cyan-600',
    features: ['Birth Date Analysis', 'Life Purpose', 'Career Guidance', 'Master Numbers']
  },
  {
    title: 'Destiny Number Calculator',
    description: 'Calculate your Destiny Number (Expression Number) from your birth name. Reveals your natural talents, abilities, and the path you\'re meant to follow.',
    href: '/us/tools/calculators/destiny-number-calculator',
    icon: '🎯',
    color: 'from-green-500 to-emerald-600',
    features: ['Birth Name Analysis', 'Life\'s Work', 'Natural Talents', 'Pythagorean & Chaldean Methods']
  },
  {
    title: 'Numerology Compatibility Calculator',
    description: 'Check relationship compatibility based on Life Path numbers. Discover your compatibility percentage, relationship strengths, and growth areas.',
    href: '/us/tools/calculators/numerology-compatibility-calculator',
    icon: '💕',
    color: 'from-pink-500 to-rose-600',
    features: ['Compatibility Score', 'Relationship Analysis', 'Strengths & Challenges', 'Auto-Calculate Option']
  }
] as const;

const zodiacCalculators = [
  {
    title: 'Zodiac Sign Calculator',
    description: 'Find your Western zodiac sign based on your birth date. Learn about your astrological personality, traits, and compatibility with other signs.',
    href: '/us/tools/calculators/zodiac-sign-calculator',
    icon: '♈',
    color: 'from-purple-500 to-pink-600',
    features: ['12 Zodiac Signs', 'Element Analysis', 'Personality Traits', 'Compatibility Matches']
  },
  {
    title: 'Chinese Zodiac Calculator',
    description: 'Discover your Chinese zodiac animal sign based on your birth year. Explore the 12-year cycle and learn about your fortune and characteristics.',
    href: '/us/tools/calculators/chinese-zodiac-calculator',
    icon: '🐉',
    color: 'from-red-500 to-orange-600',
    features: ['12 Animal Signs', 'Five Elements', 'Lucky Numbers', 'Compatibility Analysis']
  }
] as const;

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Numerology S Calculator?",
    answer: "A Numerology S Calculator is a free online tool designed to help you quickly and accurately calculate numerology s-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Numerology S Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Numerology S Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Numerology S Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function NumerologyCalculatorsClient() {
  const { getH1, getSubHeading } = usePageSEO('numerology-calculators');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-3 sm:mb-4 md:mb-6">{getH1('Numerology & Zodiac Calculators')}</h1>
            <p className="text-xl sm:text-2xl text-purple-100 max-w-3xl mx-auto mb-4 sm:mb-6 md:mb-8">
              Discover your Life Path, Destiny, soul purpose, and zodiac signs through ancient wisdom
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm sm:text-base">
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="mr-2">✓</span> Free & Accurate
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="mr-2">✓</span> Instant Results
              </div>
              <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2">
                <span className="mr-2">✓</span> Detailed Interpretations
              </div>
</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-12 sm:py-16">
        {/* Numerology Calculators Section */}
        <div className="mb-16">

      <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Numerology Calculators</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore the mystical world of numbers and uncover hidden insights about your personality, life purpose, and relationships
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-3 sm:gap-5 md:gap-8">
            {numerologyCalculators.map((calculator) => (
              <Link href={calculator.href} key={calculator.title} className="group">
                <div className="h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-r ${calculator.color} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-5xl mb-3">{calculator.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{calculator.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                      {calculator.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-3 sm:mb-4 md:mb-6">
                      {calculator.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full bg-gradient-to-r ${calculator.color} text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg`}>
                      Calculate Now →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
        <CalculatorAfterCalcBanners />

        {/* Zodiac Calculators Section */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Zodiac Calculators</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore Western and Chinese astrology to discover your zodiac signs and their influence on your life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-3 sm:gap-5 md:gap-8">
            {zodiacCalculators.map((calculator) => (
              <Link href={calculator.href} key={calculator.title} className="group">
                <div className="h-full bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden">
                  {/* Card Header with Gradient */}
                  <div className={`bg-gradient-to-r ${calculator.color} p-6 text-white`}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-5xl mb-3">{calculator.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{calculator.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-3 sm:p-4 md:p-6">
                    <p className="text-gray-600 mb-3 sm:mb-4 md:mb-6 leading-relaxed">
                      {calculator.description}
                    </p>

                    {/* Features List */}
                    <div className="space-y-2 mb-3 sm:mb-4 md:mb-6">
                      {calculator.features.map((feature) => (
                        <div key={feature} className="flex items-center text-sm text-gray-700">
                          <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                          </svg>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>

                    {/* CTA Button */}
                    <button className={`w-full bg-gradient-to-r ${calculator.color} text-white py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform group-hover:scale-105 shadow-md hover:shadow-lg`}>
                      Calculate Now →
                    </button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* What is Numerology Section */}
        <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-2xl p-8 sm:p-12 mb-16 border border-purple-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3 sm:mb-4 md:mb-6 text-center">What is Numerology?</h2>
            <div className="prose prose-lg max-w-none text-gray-700">
              <p className="mb-4">
                Numerology is the ancient study of numbers and their mystical significance in our lives. It&apos;s based on the belief that numbers carry specific vibrations and energies that influence our personality, life path, and destiny.
              </p>
              <p className="mb-4">
                Each number from 1 to 9, plus the master numbers 11, 22, and 33, has unique characteristics and meanings. By analyzing the numbers in your birth date and name, numerology can reveal profound insights about:
              </p>
              <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 my-8">
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl md:text-3xl mr-4">🎯</div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">Your Life Purpose</h3>
                    <p className="text-gray-600 text-base">Discover your soul&apos;s mission and the path you&apos;re meant to walk in this lifetime.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl md:text-3xl mr-4">💎</div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">Natural Talents</h3>
                    <p className="text-gray-600 text-base">Uncover your innate abilities and how to use them for success.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl md:text-3xl mr-4">❤️</div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">Relationships</h3>
                    <p className="text-gray-600 text-base">Understand compatibility and dynamics in personal and professional relationships.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="text-xl sm:text-2xl md:text-3xl mr-4">⚡</div>
                  <div>
                    <h3 className="text-xl font-semibold text-purple-900 mb-2">Life Challenges</h3>
                    <p className="text-gray-600 text-base">Learn about obstacles you may face and how to overcome them.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* How to Use Section */}
        <div className="bg-white rounded-2xl shadow-md p-8 sm:p-12 mb-16 border border-gray-100">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">How to Use Our Calculators</h2>
            <div className="grid md:grid-cols-3 gap-3 sm:gap-5 md:gap-8">
              <div className="text-center">
                <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Choose Calculator</h3>
                <p className="text-gray-600">Select the numerology calculator that interests you most from the options above.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Enter Information</h3>
                <p className="text-gray-600">Provide your birth date, full name, or other required information accurately.</p>
              </div>
              <div className="text-center">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Get Insights</h3>
                <p className="text-gray-600">Receive instant, detailed interpretations and guidance based on your numbers.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Core Numbers Explained */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">Understanding Core Numbers</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Each core number in numerology reveals different aspects of your personality and life path
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-4 text-center">🛤️</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Life Path</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Your life&apos;s journey and purpose. The most important number, calculated from your birth date.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-4 text-center">🎯</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Destiny</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Your life&apos;s work and goals. Calculated from your full birth name, revealing your talents.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-4 text-center">💜</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Soul Urge</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                Your inner desires and motivations. What truly drives you from within.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 md:p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="text-2xl sm:text-3xl md:text-4xl mb-4 text-center">👤</div>
              <h3 className="text-xl font-bold text-center mb-3 text-gray-900">Personality</h3>
              <p className="text-gray-600 text-sm text-center leading-relaxed">
                How others perceive you. Your outer personality and first impression.
              </p>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="bg-gray-50 rounded-2xl p-8 sm:p-12 border border-gray-200">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Is numerology scientifically proven?</h3>
                <p className="text-gray-600">
                  Numerology is an ancient metaphysical practice rather than a science. While not scientifically proven, millions of people worldwide find value in its insights for self-understanding and personal growth.
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Which calculator should I start with?</h3>
                <p className="text-gray-600">
                  Begin with the Life Path Number Calculator, as it&apos;s the most important number in numerology. Then explore your Complete Numerology Profile for a comprehensive understanding of all your core numbers.
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Do I need to use my birth name or current name?</h3>
                <p className="text-gray-600">
                  For the most accurate Destiny Number, use your full birth name as it appears on your birth certificate. Your birth name carries the original vibration given to you at birth.
                </p>
              </div>

              <div className="bg-white rounded-lg p-3 sm:p-4 md:p-6 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">What are master numbers?</h3>
                <p className="text-gray-600">
                  Master numbers are 11, 22, and 33. These numbers are not reduced to single digits as they carry special spiritual significance and heightened potential. They indicate a higher spiritual calling.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="numerology-calculators" fallbackFaqs={fallbackFaqs} />
      </div>

      {/* MREC Advertisement Banners */}
    </div>
  );
}
