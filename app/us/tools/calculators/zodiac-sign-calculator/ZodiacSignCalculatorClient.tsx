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

interface ZodiacSignCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
  quality: string;
  ruler: string;
  traits: string;
  strengths: string;
  weaknesses: string;
  compatibility: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const zodiacSigns: Record<string, ZodiacSign> = {
  aries: {
    name: 'Aries',
    symbol: '♈',
    dates: 'March 21 - April 19',
    element: 'Fire',
    quality: 'Cardinal',
    ruler: 'Mars',
    traits: 'Bold, ambitious, energetic, impulsive, courageous',
    strengths: 'Courageous, determined, confident, enthusiastic, optimistic, honest, passionate',
    weaknesses: 'Impatient, moody, short-tempered, impulsive, aggressive',
    compatibility: 'Leo, Sagittarius, Gemini, Aquarius',
    description: 'Aries are natural leaders with a pioneering spirit. You\'re bold, ambitious, and always ready to take on new challenges. Your energy and enthusiasm are contagious.',
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-500'
  },
  taurus: {
    name: 'Taurus',
    symbol: '♉',
    dates: 'April 20 - May 20',
    element: 'Earth',
    quality: 'Fixed',
    ruler: 'Venus',
    traits: 'Reliable, patient, practical, devoted, responsible',
    strengths: 'Reliable, patient, practical, devoted, responsible, stable',
    weaknesses: 'Stubborn, possessive, uncompromising',
    compatibility: 'Cancer, Virgo, Capricorn, Pisces',
    description: 'Taurus individuals are grounded and reliable. You value stability, comfort, and the finer things in life. Your determination and patience help you achieve your goals.',
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-500'
  },
  gemini: {
    name: 'Gemini',
    symbol: '♊',
    dates: 'May 21 - June 20',
    element: 'Air',
    quality: 'Mutable',
    ruler: 'Mercury',
    traits: 'Versatile, expressive, curious, adaptable',
    strengths: 'Gentle, affectionate, curious, adaptable, quick learner',
    weaknesses: 'Nervous, inconsistent, indecisive',
    compatibility: 'Aries, Leo, Libra, Aquarius',
    description: 'Geminis are versatile and curious. You have a quick mind and love communication. Your adaptability and social nature make you excellent at connecting with others.',
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-500'
  },
  cancer: {
    name: 'Cancer',
    symbol: '♋',
    dates: 'June 21 - July 22',
    element: 'Water',
    quality: 'Cardinal',
    ruler: 'Moon',
    traits: 'Intuitive, emotional, protective, sympathetic',
    strengths: 'Tenacious, highly imaginative, loyal, emotional, sympathetic',
    weaknesses: 'Moody, pessimistic, suspicious, manipulative, insecure',
    compatibility: 'Taurus, Virgo, Scorpio, Pisces',
    description: 'Cancers are deeply intuitive and emotional. You\'re protective of loved ones and have a strong connection to home and family. Your empathy is your superpower.',
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-500'
  },
  leo: {
    name: 'Leo',
    symbol: '♌',
    dates: 'July 23 - August 22',
    element: 'Fire',
    quality: 'Fixed',
    ruler: 'Sun',
    traits: 'Confident, generous, warm-hearted, cheerful',
    strengths: 'Creative, passionate, generous, warm-hearted, cheerful, humorous',
    weaknesses: 'Arrogant, stubborn, self-centered, lazy, inflexible',
    compatibility: 'Aries, Gemini, Libra, Sagittarius',
    description: 'Leos are natural-born leaders with magnetic personalities. You\'re confident, generous, and love being in the spotlight. Your warmth draws people to you.',
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-500'
  },
  virgo: {
    name: 'Virgo',
    symbol: '♍',
    dates: 'August 23 - September 22',
    element: 'Earth',
    quality: 'Mutable',
    ruler: 'Mercury',
    traits: 'Analytical, practical, loyal, hardworking',
    strengths: 'Loyal, analytical, kind, hardworking, practical',
    weaknesses: 'Shy, worry, overly critical, all work and no play',
    compatibility: 'Taurus, Cancer, Scorpio, Capricorn',
    description: 'Virgos are analytical perfectionists. You have a keen eye for detail and a practical approach to life. Your dedication and reliability make you invaluable.',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-600'
  },
  libra: {
    name: 'Libra',
    symbol: '♎',
    dates: 'September 23 - October 22',
    element: 'Air',
    quality: 'Cardinal',
    ruler: 'Venus',
    traits: 'Diplomatic, fair-minded, social, gracious',
    strengths: 'Cooperative, diplomatic, gracious, fair-minded, social',
    weaknesses: 'Indecisive, avoids confrontations, self-pity',
    compatibility: 'Gemini, Leo, Sagittarius, Aquarius',
    description: 'Libras seek balance and harmony. You\'re diplomatic, fair-minded, and have excellent social skills. Your charm and grace make you naturally likeable.',
    color: 'text-pink-600',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-500'
  },
  scorpio: {
    name: 'Scorpio',
    symbol: '♏',
    dates: 'October 23 - November 21',
    element: 'Water',
    quality: 'Fixed',
    ruler: 'Pluto',
    traits: 'Passionate, resourceful, brave, determined',
    strengths: 'Resourceful, brave, passionate, stubborn, true friend',
    weaknesses: 'Distrusting, jealous, secretive, violent',
    compatibility: 'Cancer, Virgo, Capricorn, Pisces',
    description: 'Scorpios are intense and passionate. You have incredible emotional depth and transformative power. Your loyalty and determination are unmatched.',
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-500'
  },
  sagittarius: {
    name: 'Sagittarius',
    symbol: '♐',
    dates: 'November 22 - December 21',
    element: 'Fire',
    quality: 'Mutable',
    ruler: 'Jupiter',
    traits: 'Optimistic, adventurous, independent, philosophical',
    strengths: 'Generous, idealistic, great sense of humor',
    weaknesses: 'Promises more than can deliver, impatient, tactless',
    compatibility: 'Aries, Leo, Libra, Aquarius',
    description: 'Sagittarians are adventurous optimists. You love freedom, travel, and philosophical discussions. Your enthusiasm for life is inspiring.',
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    borderColor: 'border-indigo-500'
  },
  capricorn: {
    name: 'Capricorn',
    symbol: '♑',
    dates: 'December 22 - January 19',
    element: 'Earth',
    quality: 'Cardinal',
    ruler: 'Saturn',
    traits: 'Disciplined, responsible, self-controlled, ambitious',
    strengths: 'Responsible, disciplined, self-control, good managers',
    weaknesses: 'Know-it-all, unforgiving, condescending, pessimistic',
    compatibility: 'Taurus, Virgo, Scorpio, Pisces',
    description: 'Capricorns are ambitious achievers. You\'re disciplined, responsible, and have a strong work ethic. Your determination leads you to great success.',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-600'
  },
  aquarius: {
    name: 'Aquarius',
    symbol: '♒',
    dates: 'January 20 - February 18',
    element: 'Air',
    quality: 'Fixed',
    ruler: 'Uranus',
    traits: 'Progressive, original, independent, humanitarian',
    strengths: 'Progressive, original, independent, humanitarian',
    weaknesses: 'Runs from emotional expression, temperamental, uncompromising',
    compatibility: 'Aries, Gemini, Libra, Sagittarius',
    description: 'Aquarians are innovative visionaries. You\'re progressive, independent, and value intellectual stimulation. Your humanitarian nature drives you to make the world better.',
    color: 'text-cyan-600',
    bgColor: 'bg-cyan-50',
    borderColor: 'border-cyan-500'
  },
  pisces: {
    name: 'Pisces',
    symbol: '♓',
    dates: 'February 19 - March 20',
    element: 'Water',
    quality: 'Mutable',
    ruler: 'Neptune',
    traits: 'Compassionate, artistic, intuitive, gentle',
    strengths: 'Compassionate, artistic, intuitive, gentle, wise, musical',
    weaknesses: 'Fearful, overly trusting, sad, escape reality, victim mentality',
    compatibility: 'Taurus, Cancer, Scorpio, Capricorn',
    description: 'Pisces are compassionate dreamers. You\'re artistic, intuitive, and deeply empathetic. Your creativity and spiritual nature set you apart.',
    color: 'text-teal-600',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-500'
  }
};

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Zodiac Sign Calculator?",
    answer: "A Zodiac Sign Calculator is a free online tool designed to help you quickly and accurately calculate zodiac sign-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Zodiac Sign Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Zodiac Sign Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Zodiac Sign Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ZodiacSignCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: ZodiacSignCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('zodiac-sign-calculator');

  const [birthDate, setBirthDate] = useState('1990-05-15');
  const [result, setResult] = useState<ZodiacSign | null>(null);

  const getZodiacSign = (month: number, day: number): string => {
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'aries';
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'taurus';
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'gemini';
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'cancer';
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'leo';
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'virgo';
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'libra';
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'scorpio';
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'sagittarius';
    if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'capricorn';
    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'aquarius';
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'pisces';
    return 'aries';
  };

  const calculateZodiacSign = () => {
    if (!birthDate) {
      alert('Please enter your birth date');
      return;
    }

    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();

    const signKey = getZodiacSign(month, day);
    const sign = zodiacSigns[signKey];

    setResult(sign);
  };

  useEffect(() => {
    calculateZodiacSign();
  }, [birthDate]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-8 sm:py-12">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Zodiac Sign Calculator')}</h1>
          <p className="text-base text-gray-600 max-w-2xl mx-auto">Discover your zodiac sign and learn about your astrological personality</p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-3 sm:gap-5 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Find Your Zodiac Sign</h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  onClick={calculateZodiacSign}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-md hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md"
                >
                  Find My Zodiac Sign
                </button>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Results Section */}
            {result && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Your Zodiac Sign</h3>
                <div>
                  <div className="text-center mb-3 sm:mb-4 md:mb-6">
                    <div className="text-8xl mb-4">{result.symbol}</div>
                    <div className={`text-4xl font-bold ${result.color} mb-2`}>{result.name}</div>
                    <div className="text-lg text-gray-600">{result.dates}</div>
                  </div>

                  <div className={`${result.bgColor} rounded-lg p-6 mb-6 border-l-4 ${result.borderColor}`}>
                    <h4 className={`text-lg font-semibold ${result.color} mb-3`}>About {result.name}</h4>
                    <p className="text-gray-700">{result.description}</p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                    <div className="bg-white border rounded-lg p-4">
                      <h5 className={`font-semibold ${result.color} mb-3`}>Element & Quality</h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Element:</span>
                          <span className="font-semibold">{result.element}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Quality:</span>
                          <span className="font-semibold">{result.quality}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Ruling Planet:</span>
                          <span className="font-semibold">{result.ruler}</span>
                        </div>
                      </div>
                    </div>
<div className="bg-white border rounded-lg p-4">
                      <h5 className={`font-semibold ${result.color} mb-3`}>Key Traits</h5>
                      <p className="text-sm text-gray-700">{result.traits}</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
                    <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                      <h5 className="font-semibold text-green-800 mb-2">Strengths</h5>
                      <p className="text-sm text-green-700">{result.strengths}</p>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                      <h5 className="font-semibold text-orange-800 mb-2">Challenges</h5>
                      <p className="text-sm text-orange-700">{result.weaknesses}</p>
                    </div>
                  </div>

                  <div className="mt-6 bg-purple-50 rounded-lg p-4 border-l-4 border-purple-500">
                    <h5 className="font-semibold text-purple-800 mb-2">Best Compatibility</h5>
                    <p className="text-sm text-purple-700">{result.compatibility}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">About Zodiac Signs</h3>
              <div className="prose max-w-none text-gray-700 space-y-4">
                <p>The zodiac is divided into 12 signs, each representing different personality traits, characteristics, and life approaches. Your zodiac sign, also called your sun sign, is determined by the position of the sun at the time of your birth.</p>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">The 12 Zodiac Signs:</h4>
                <div className="grid md:grid-cols-2 gap-4 my-4">
                  <div className="border-l-4 border-red-500 pl-4">
                    <strong className="text-red-700">Aries ♈ (March 21 - April 19)</strong>
                    <p className="text-sm text-gray-600">Bold, ambitious, energetic</p>
                  </div>
                  <div className="border-l-4 border-green-500 pl-4">
                    <strong className="text-green-700">Taurus ♉ (April 20 - May 20)</strong>
                    <p className="text-sm text-gray-600">Reliable, patient, practical</p>
                  </div>
                  <div className="border-l-4 border-yellow-500 pl-4">
                    <strong className="text-yellow-700">Gemini ♊ (May 21 - June 20)</strong>
                    <p className="text-sm text-gray-600">Versatile, expressive, curious</p>
                  </div>
                  <div className="border-l-4 border-blue-500 pl-4">
                    <strong className="text-blue-700">Cancer ♋ (June 21 - July 22)</strong>
                    <p className="text-sm text-gray-600">Intuitive, emotional, protective</p>
                  </div>
                  <div className="border-l-4 border-orange-500 pl-4">
                    <strong className="text-orange-700">Leo ♌ (July 23 - August 22)</strong>
                    <p className="text-sm text-gray-600">Confident, generous, warm-hearted</p>
                  </div>
                  <div className="border-l-4 border-green-600 pl-4">
                    <strong className="text-green-700">Virgo ♍ (August 23 - September 22)</strong>
                    <p className="text-sm text-gray-600">Analytical, practical, loyal</p>
                  </div>
                  <div className="border-l-4 border-pink-500 pl-4">
                    <strong className="text-pink-700">Libra ♎ (September 23 - October 22)</strong>
                    <p className="text-sm text-gray-600">Diplomatic, fair-minded, social</p>
                  </div>
                  <div className="border-l-4 border-purple-500 pl-4">
                    <strong className="text-purple-700">Scorpio ♏ (October 23 - November 21)</strong>
                    <p className="text-sm text-gray-600">Passionate, resourceful, brave</p>
                  </div>
                  <div className="border-l-4 border-indigo-500 pl-4">
                    <strong className="text-indigo-700">Sagittarius ♐ (November 22 - December 21)</strong>
                    <p className="text-sm text-gray-600">Optimistic, adventurous, independent</p>
                  </div>
                  <div className="border-l-4 border-gray-600 pl-4">
                    <strong className="text-gray-700">Capricorn ♑ (December 22 - January 19)</strong>
                    <p className="text-sm text-gray-600">Disciplined, responsible, self-controlled</p>
                  </div>
                  <div className="border-l-4 border-cyan-500 pl-4">
                    <strong className="text-cyan-700">Aquarius ♒ (January 20 - February 18)</strong>
                    <p className="text-sm text-gray-600">Progressive, original, independent</p>
                  </div>
                  <div className="border-l-4 border-teal-500 pl-4">
                    <strong className="text-teal-700">Pisces ♓ (February 19 - March 20)</strong>
                    <p className="text-sm text-gray-600">Compassionate, artistic, intuitive</p>
                  </div>
                </div>

                <h4 className="text-lg font-semibold text-gray-900 mt-6">Zodiac Elements:</h4>
                <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Fire Signs</strong> (Aries, Leo, Sagittarius): Passionate, dynamic, temperamental</li>
                  <li><strong>Earth Signs</strong> (Taurus, Virgo, Capricorn): Grounded, practical, stable</li>
                  <li><strong>Air Signs</strong> (Gemini, Libra, Aquarius): Intellectual, communicative, social</li>
                  <li><strong>Water Signs</strong> (Cancer, Scorpio, Pisces): Emotional, intuitive, sensitive</li>
                </ul>
              </div>
            </div>
          </div>
          {/* End Main Content */}

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Zodiac Elements */}
            <div className="bg-gradient-to-br from-purple-50 to-indigo-50 rounded-lg shadow-sm border border-purple-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Zodiac Elements</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-red-700">🔥 Fire Signs:</strong>
                  <p className="text-gray-700">Aries, Leo, Sagittarius - Passionate and dynamic</p>
                </div>
                <div>
                  <strong className="text-green-700">🌍 Earth Signs:</strong>
                  <p className="text-gray-700">Taurus, Virgo, Capricorn - Grounded and practical</p>
                </div>
                <div>
                  <strong className="text-blue-700">💨 Air Signs:</strong>
                  <p className="text-gray-700">Gemini, Libra, Aquarius - Intellectual and social</p>
                </div>
                <div>
                  <strong className="text-cyan-700">💧 Water Signs:</strong>
                  <p className="text-gray-700">Cancer, Scorpio, Pisces - Emotional and intuitive</p>
                </div>
              </div>
            </div>

            {/* Modalities */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">Zodiac Modalities</h3>
              <div className="space-y-3 text-sm">
                <div>
                  <strong className="text-purple-700">Cardinal:</strong>
                  <p className="text-gray-600">Aries, Cancer, Libra, Capricorn - Initiators</p>
                </div>
                <div>
                  <strong className="text-indigo-700">Fixed:</strong>
                  <p className="text-gray-600">Taurus, Leo, Scorpio, Aquarius - Stabilizers</p>
                </div>
                <div>
                  <strong className="text-purple-700">Mutable:</strong>
                  <p className="text-gray-600">Gemini, Virgo, Sagittarius, Pisces - Adapters</p>
                </div>
              </div>
            </div>

            {/* Did You Know */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-lg shadow-sm border border-yellow-200 p-3 sm:p-4 md:p-6">
              <h3 className="text-lg font-semibold text-orange-900 mb-4">Did You Know?</h3>
              <p className="text-sm text-gray-700">The word "zodiac" comes from the Greek term "zodiakos kyklos," meaning "circle of animals." Most zodiac signs are represented by animals.</p>
            </div>
          </aside>
          {/* End Sidebar */}
        </div>
      </div>

      {/* MREC Advertisement Banners */}
{/* Related Calculators */}
      <div className="bg-white py-12">
        <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 sm:mb-6 md:mb-8 text-center">Related Calculators</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
            {relatedCalculators.map((calc, index) => (
              <Link
                key={index}
                href={calc.href}
                className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 md:p-6 hover:shadow-lg transition-shadow duration-300"
              >
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
        <FirebaseFAQs pageId="zodiac-sign-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
