'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color?: string;
  icon?: string;
}

interface ChineseZodiacClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ZodiacAnimal {
  animal: string;
  emoji: string;
  traits: string;
  personality: string;
  luckyNumbers: string;
  luckyColors: string;
  luckyFlowers: string;
  compatibility: string;
  incompatible: string;
  years: string;
  strengths: string;
  weaknesses: string;
  color: string;
  bgColor: string;
  borderColor: string;
}

const chineseZodiac: Record<string, ZodiacAnimal> = {
  rat: {
    animal: 'Rat',
    emoji: '🐀',
    traits: 'Quick-witted, resourceful, versatile, kind',
    personality: 'Rats are quick-witted and resourceful. You\'re intelligent, adaptable, and have excellent survival instincts. Your charm and creativity help you succeed in various situations.',
    luckyNumbers: '2, 3',
    luckyColors: 'Blue, Gold, Green',
    luckyFlowers: 'Lily, African Violet',
    compatibility: 'Ox, Dragon, Monkey',
    incompatible: 'Horse, Rooster',
    years: '1924, 1936, 1948, 1960, 1972, 1984, 1996, 2008, 2020, 2032',
    strengths: 'Intelligent, adaptable, quick-witted, charming, artistic, sociable',
    weaknesses: 'Timid, unstable, stubborn, picky, lack of persistence',
    color: 'text-gray-700',
    bgColor: 'bg-gray-50',
    borderColor: 'border-gray-600'
  },
  ox: {
    animal: 'Ox',
    emoji: '🐂',
    traits: 'Diligent, dependable, strong, determined',
    personality: 'Oxen are hardworking and reliable. You have great patience and a strong sense of responsibility. Your determination and honesty make you trustworthy.',
    luckyNumbers: '1, 4',
    luckyColors: 'White, Yellow, Green',
    luckyFlowers: 'Tulip, Peach Blossom',
    compatibility: 'Rat, Snake, Rooster',
    incompatible: 'Tiger, Dragon, Horse, Goat',
    years: '1925, 1937, 1949, 1961, 1973, 1985, 1997, 2009, 2021, 2033',
    strengths: 'Honest, industrious, patient, cautious, strong, reliable',
    weaknesses: 'Obstinate, inarticulate, prudish, stubborn',
    color: 'text-green-700',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-600'
  },
  tiger: {
    animal: 'Tiger',
    emoji: '🐅',
    traits: 'Brave, confident, competitive',
    personality: 'Tigers are brave and confident leaders. You\'re full of energy, with a natural authority and charisma. Your courage helps you face challenges head-on.',
    luckyNumbers: '1, 3, 4',
    luckyColors: 'Blue, Grey, Orange',
    luckyFlowers: 'Yellow Lily, Cineraria',
    compatibility: 'Dragon, Horse, Pig',
    incompatible: 'Ox, Tiger, Snake, Monkey',
    years: '1926, 1938, 1950, 1962, 1974, 1986, 1998, 2010, 2022, 2034',
    strengths: 'Brave, confident, competitive, charismatic, courageous',
    weaknesses: 'Arrogant, short-tempered, hasty, traitorous',
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-600'
  },
  rabbit: {
    animal: 'Rabbit',
    emoji: '🐇',
    traits: 'Quiet, elegant, kind, responsible',
    personality: 'Rabbits are gentle and compassionate. You\'re elegant, kind, and have excellent taste. Your calm demeanor and diplomatic skills help maintain harmony.',
    luckyNumbers: '3, 4, 6',
    luckyColors: 'Red, Pink, Purple, Blue',
    luckyFlowers: 'Plantain Lily, Jasmine',
    compatibility: 'Goat, Monkey, Dog, Pig',
    incompatible: 'Snake, Rooster',
    years: '1927, 1939, 1951, 1963, 1975, 1987, 1999, 2011, 2023, 2035',
    strengths: 'Gentle, compassionate, amiable, modest, merciful',
    weaknesses: 'Amorous, hesitant, stubborn, timid, conservative',
    color: 'text-pink-700',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-500'
  },
  dragon: {
    animal: 'Dragon',
    emoji: '🐉',
    traits: 'Confident, intelligent, enthusiastic',
    personality: 'Dragons are powerful and charismatic. You\'re confident, intelligent, and have natural leadership abilities. Your enthusiasm and determination lead to great achievements.',
    luckyNumbers: '1, 6, 7',
    luckyColors: 'Gold, Silver, Hoary',
    luckyFlowers: 'Bleeding-heart Glory Bower, Dragon Flowers',
    compatibility: 'Rooster, Rat, Monkey',
    incompatible: 'Ox, Goat, Dog',
    years: '1928, 1940, 1952, 1964, 1976, 1988, 2000, 2012, 2024, 2036',
    strengths: 'Decisive, pioneering, ambitious, energetic, intelligent',
    weaknesses: 'Eccentric, tactless, fiery, intolerant, unrealistic',
    color: 'text-yellow-700',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-600'
  },
  snake: {
    animal: 'Snake',
    emoji: '🐍',
    traits: 'Enigmatic, intelligent, wise',
    personality: 'Snakes are wise and intuitive. You\'re intelligent, graceful, and possess deep wisdom. Your analytical mind and calm demeanor help you make sound decisions.',
    luckyNumbers: '2, 8, 9',
    luckyColors: 'Black, Red, Yellow',
    luckyFlowers: 'Orchid, Cactus',
    compatibility: 'Dragon, Rooster',
    incompatible: 'Tiger, Rabbit, Goat, Pig',
    years: '1929, 1941, 1953, 1965, 1977, 1989, 2001, 2013, 2025, 2037',
    strengths: 'Soft-spoken, humorous, sympathetic, determined, passionate',
    weaknesses: 'Jealous, suspicious, cunning, self-centered',
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-600'
  },
  horse: {
    animal: 'Horse',
    emoji: '🐴',
    traits: 'Animated, active, energetic',
    personality: 'Horses are energetic and free-spirited. You\'re active, enthusiastic, and love independence. Your optimistic nature and social skills make you popular.',
    luckyNumbers: '2, 3, 7',
    luckyColors: 'Yellow, Green',
    luckyFlowers: 'Calla Lily, Jasmine',
    compatibility: 'Tiger, Goat, Dog',
    incompatible: 'Rat, Ox, Rooster',
    years: '1930, 1942, 1954, 1966, 1978, 1990, 2002, 2014, 2026, 2038',
    strengths: 'Warm-hearted, enthusiastic, positive, independent',
    weaknesses: 'Impatient, hot blooded, reckless, self-centered',
    color: 'text-amber-800',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-700'
  },
  goat: {
    animal: 'Goat',
    emoji: '🐐',
    traits: 'Calm, gentle, sympathetic',
    personality: 'Goats are gentle and peaceful. You\'re calm, artistic, and have a kind heart. Your creativity and empathy make you sensitive to others\' needs.',
    luckyNumbers: '2, 7',
    luckyColors: 'Brown, Red, Purple',
    luckyFlowers: 'Carnation, Primrose',
    compatibility: 'Rabbit, Horse, Pig',
    incompatible: 'Ox, Dog',
    years: '1931, 1943, 1955, 1967, 1979, 1991, 2003, 2015, 2027, 2039',
    strengths: 'Calm, gentle, sympathetic, artistic, persevering',
    weaknesses: 'Moody, indecisive, timid, vain, pessimistic',
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-600'
  },
  monkey: {
    animal: 'Monkey',
    emoji: '🐒',
    traits: 'Sharp, smart, curious',
    personality: 'Monkeys are clever and versatile. You\'re witty, intelligent, and have a great sense of humor. Your curiosity and problem-solving skills lead to innovation.',
    luckyNumbers: '1, 7, 8',
    luckyColors: 'White, Blue, Gold',
    luckyFlowers: 'Chrysanthemum, Alliums',
    compatibility: 'Ox, Rabbit, Dragon',
    incompatible: 'Tiger, Pig',
    years: '1932, 1944, 1956, 1968, 1980, 1992, 2004, 2016, 2028, 2040',
    strengths: 'Enthusiastic, self-assured, sociable, innovative',
    weaknesses: 'Jealous, suspicious, cunning, selfish, arrogant',
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-600'
  },
  rooster: {
    animal: 'Rooster',
    emoji: '🐓',
    traits: 'Observant, hardworking, courageous',
    personality: 'Roosters are confident and hardworking. You\'re observant, responsible, and have high standards. Your attention to detail and courage make you reliable.',
    luckyNumbers: '5, 7, 8',
    luckyColors: 'Gold, Brown, Yellow',
    luckyFlowers: 'Gladiola, Cockscomb',
    compatibility: 'Ox, Dragon, Snake',
    incompatible: 'Rat, Rabbit, Horse, Rooster, Dog',
    years: '1933, 1945, 1957, 1969, 1981, 1993, 2005, 2017, 2029, 2041',
    strengths: 'Honest, energetic, intelligent, flexible, confident',
    weaknesses: 'Impatient, critical, eccentric, narrow-minded',
    color: 'text-yellow-800',
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-700'
  },
  dog: {
    animal: 'Dog',
    emoji: '🐕',
    traits: 'Lovely, honest, prudent',
    personality: 'Dogs are loyal and honest. You\'re faithful, sincere, and have a strong sense of duty. Your protective nature and integrity make you a true friend.',
    luckyNumbers: '3, 4, 9',
    luckyColors: 'Green, Red, Purple',
    luckyFlowers: 'Rose, Cymbidium Orchids',
    compatibility: 'Rabbit, Tiger, Horse',
    incompatible: 'Ox, Dragon, Goat, Rooster',
    years: '1934, 1946, 1958, 1970, 1982, 1994, 2006, 2018, 2030, 2042',
    strengths: 'Honest, friendly, faithful, loyal, smart, straight-forward',
    weaknesses: 'Emotional, conservative, stubborn, sharp-tongued',
    color: 'text-amber-900',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-800'
  },
  pig: {
    animal: 'Pig',
    emoji: '🐖',
    traits: 'Compassionate, generous, diligent',
    personality: 'Pigs are kind and generous. You\'re compassionate, trusting, and enjoy the good things in life. Your optimism and warm heart attract good fortune.',
    luckyNumbers: '2, 5, 8',
    luckyColors: 'Yellow, Grey, Brown, Gold',
    luckyFlowers: 'Hydrangea, Daisy',
    compatibility: 'Tiger, Rabbit, Goat',
    incompatible: 'Snake, Monkey',
    years: '1935, 1947, 1959, 1971, 1983, 1995, 2007, 2019, 2031, 2043',
    strengths: 'Compassionate, generous, diligent, optimistic, honest',
    weaknesses: 'Naive, gullible, sluggish, short-tempered',
    color: 'text-pink-800',
    bgColor: 'bg-pink-50',
    borderColor: 'border-pink-700'
  }
};

const allAnimalsInfo = [
  { emoji: '🐀', name: 'Rat', trait: 'Quick-witted, resourceful, versatile', color: 'border-gray-700' },
  { emoji: '🐂', name: 'Ox', trait: 'Diligent, dependable, strong', color: 'border-green-600' },
  { emoji: '🐅', name: 'Tiger', trait: 'Brave, confident, competitive', color: 'border-orange-600' },
  { emoji: '🐇', name: 'Rabbit', trait: 'Quiet, elegant, kind', color: 'border-pink-500' },
  { emoji: '🐉', name: 'Dragon', trait: 'Confident, intelligent, enthusiastic', color: 'border-yellow-600' },
  { emoji: '🐍', name: 'Snake', trait: 'Enigmatic, intelligent, wise', color: 'border-red-600' },
  { emoji: '🐴', name: 'Horse', trait: 'Animated, active, energetic', color: 'border-amber-700' },
  { emoji: '🐐', name: 'Goat', trait: 'Calm, gentle, sympathetic', color: 'border-teal-600' },
  { emoji: '🐒', name: 'Monkey', trait: 'Sharp, smart, curious', color: 'border-amber-600' },
  { emoji: '🐓', name: 'Rooster', trait: 'Observant, hardworking, courageous', color: 'border-yellow-700' },
  { emoji: '🐕', name: 'Dog', trait: 'Lovely, honest, prudent', color: 'border-amber-800' },
  { emoji: '🐖', name: 'Pig', trait: 'Compassionate, generous, diligent', color: 'border-pink-700' }
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Chinese Zodiac Calculator?",
    answer: "A Chinese Zodiac Calculator is a free online tool designed to help you quickly and accurately calculate chinese zodiac-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Chinese Zodiac Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Chinese Zodiac Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Chinese Zodiac Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function ChineseZodiacClient({ relatedCalculators = defaultRelatedCalculators }: ChineseZodiacClientProps) {
  const { getH1, getSubHeading } = usePageSEO('chinese-zodiac-calculator');

  const [birthYear, setBirthYear] = useState(1990);
  const [zodiacAnimal, setZodiacAnimal] = useState<ZodiacAnimal | null>(null);
  const [element, setElement] = useState('');

  useEffect(() => {
    calculateZodiac();
  }, [birthYear]);

  const getChineseZodiac = (year: number): string => {
    const animals = ['monkey', 'rooster', 'dog', 'pig', 'rat', 'ox', 'tiger', 'rabbit', 'dragon', 'snake', 'horse', 'goat'];
    return animals[year % 12];
  };

  const getElement = (year: number): string => {
    const lastDigit = year % 10;
    const elements: Record<number, string> = {
      0: 'Metal', 1: 'Metal',
      2: 'Water', 3: 'Water',
      4: 'Wood', 5: 'Wood',
      6: 'Fire', 7: 'Fire',
      8: 'Earth', 9: 'Earth'
    };
    return elements[lastDigit];
  };

  const calculateZodiac = () => {
    if (!birthYear || birthYear < 1900 || birthYear > 2100) {
      setZodiacAnimal(null);
      return;
    }

    const animalKey = getChineseZodiac(birthYear);
    const animal = chineseZodiac[animalKey];
    const elem = getElement(birthYear);

    setZodiacAnimal(animal);
    setElement(elem);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 py-6 md:py-12">
        <div className="text-center mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-3">{getH1('Chinese Zodiac Calculator')}</h1>
          <p className="text-sm md:text-base text-gray-600 max-w-2xl mx-auto">
            Discover your Chinese zodiac animal and learn about your personality traits
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {/* Calculator Card */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">
                Find Your Chinese Zodiac Animal
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Year</label>
                  <input
                    type="number"
                    value={birthYear}
                    onChange={(e) => setBirthYear(parseInt(e.target.value) || 0)}
                    min="1900"
                    max="2100"
                    className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>
            </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

            {/* Results Section */}
            {zodiacAnimal && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                  Your Chinese Zodiac Animal
                </h3>

                <div className="text-center mb-3 sm:mb-4 md:mb-6">
                  <div className="text-6xl md:text-8xl mb-4">{zodiacAnimal.emoji}</div>
                  <div className={`text-3xl md:text-4xl font-bold ${zodiacAnimal.color} mb-2`}>
                    {zodiacAnimal.animal}
                  </div>
                  <div className="text-base md:text-lg text-gray-600">
                    {element} {zodiacAnimal.animal}
                  </div>
                  <div className="text-xs md:text-sm text-gray-500 mt-2">Born in {birthYear}</div>
                </div>

                <div className={`${zodiacAnimal.bgColor} rounded-lg p-4 sm:p-6 mb-6 border-l-4 ${zodiacAnimal.borderColor}`}>
                  <h4 className={`text-base md:text-lg font-semibold ${zodiacAnimal.color} mb-3`}>
                    About {zodiacAnimal.animal}
                  </h4>
                  <p className="text-sm md:text-base text-gray-700 mb-3">{zodiacAnimal.personality}</p>
                  <p className="text-xs md:text-sm text-gray-600">
                    <strong>Key Traits:</strong> {zodiacAnimal.traits}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-white border rounded-lg p-4">
                    <h5 className={`font-semibold ${zodiacAnimal.color} mb-3`}>Lucky Elements</h5>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lucky Numbers:</span>
                        <span className="font-semibold">{zodiacAnimal.luckyNumbers}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lucky Colors:</span>
                        <span className="font-semibold">{zodiacAnimal.luckyColors}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lucky Flowers:</span>
                        <span className="font-semibold">{zodiacAnimal.luckyFlowers}</span>
                      </div>
                    </div>
                  </div>
<div className="bg-white border rounded-lg p-4">
                    <h5 className={`font-semibold ${zodiacAnimal.color} mb-3`}>Compatibility</h5>
                    <div className="space-y-2 text-xs md:text-sm">
                      <div>
                        <span className="text-gray-600">Best Matches:</span>
                        <p className="font-semibold text-green-700">{zodiacAnimal.compatibility}</p>
                      </div>
                      <div>
                        <span className="text-gray-600">Avoid:</span>
                        <p className="font-semibold text-red-700">{zodiacAnimal.incompatible}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 md:gap-6 mb-3 sm:mb-4 md:mb-6">
                  <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-500">
                    <h5 className="font-semibold text-green-800 mb-2">Strengths</h5>
                    <p className="text-xs md:text-sm text-green-700">{zodiacAnimal.strengths}</p>
                  </div>
                  <div className="bg-orange-50 rounded-lg p-4 border-l-4 border-orange-500">
                    <h5 className="font-semibold text-orange-800 mb-2">Challenges</h5>
                    <p className="text-xs md:text-sm text-orange-700">{zodiacAnimal.weaknesses}</p>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-500">
                  <h5 className="font-semibold text-blue-800 mb-2">{zodiacAnimal.animal} Years</h5>
                  <p className="text-xs md:text-sm text-blue-700">{zodiacAnimal.years}</p>
                </div>
              </div>
            )}

            {/* Information Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 mb-3 sm:mb-4 md:mb-6">
              <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">
                About Chinese Zodiac
              </h3>
              <div className="prose max-w-none text-sm md:text-base text-gray-700 space-y-4">
                <p>
                  The Chinese zodiac, or Shengxiao, is a 12-year cycle where each year is represented by
                  a different animal. Your Chinese zodiac sign is determined by your birth year and is
                  believed to influence your personality, fortune, and compatibility.
                </p>

                <h4 className="text-base md:text-lg font-semibold text-gray-900 mt-6">
                  The 12 Chinese Zodiac Animals:
                </h4>
                <div className="grid sm:grid-cols-2 gap-3 md:gap-4 my-4">
                  {allAnimalsInfo.map((animal, index) => (
                    <div key={index} className={`border-l-4 ${animal.color} pl-3 md:pl-4`}>
                      <strong className="text-gray-800">
                        {animal.emoji} {animal.name}
                      </strong>
                      <p className="text-xs md:text-sm text-gray-600">{animal.trait}</p>
                    </div>
                  ))}
                </div>

                <h4 className="text-base md:text-lg font-semibold text-gray-900 mt-6">Five Elements:</h4>
                <p className="text-sm md:text-base">
                  Each zodiac year is also associated with one of five elements: Wood, Fire, Earth,
                  Metal, and Water. The combination of animal and element occurs in a 60-year cycle.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm md:text-base">
                  <li>
                    <strong>Wood</strong>: Growth, creativity, idealism
                  </li>
                  <li>
                    <strong>Fire</strong>: Passion, energy, dynamic
                  </li>
                  <li>
                    <strong>Earth</strong>: Stability, practicality, reliability
                  </li>
                  <li>
                    <strong>Metal</strong>: Determination, strength, persistence
                  </li>
                  <li>
                    <strong>Water</strong>: Wisdom, flexibility, intuition
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:w-80 w-full space-y-3 sm:space-y-4 md:space-y-6">
            {/* Zodiac Cycle */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-lg shadow-sm border border-red-200 p-3 sm:p-4">
              <h3 className="text-base md:text-lg font-semibold text-red-900 mb-4">12-Year Cycle</h3>
              <div className="space-y-2 text-xs md:text-sm text-gray-700">
                <p>
                  The Chinese zodiac follows a 12-year cycle, with each year represented by a different
                  animal.
                </p>
                <p className="font-semibold text-red-700 mt-3">Order of Animals:</p>
                <p className="text-xs md:text-sm">
                  Rat → Ox → Tiger → Rabbit → Dragon → Snake → Horse → Goat → Monkey → Rooster →
                  Dog → Pig
                </p>
              </div>
            </div>

            {/* Lucky Elements */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
              <h3 className="text-base md:text-lg font-semibold text-red-900 mb-4">Five Elements</h3>
              <div className="space-y-3 text-xs md:text-sm">
                <div>
                  <strong className="text-green-700">🌳 Wood:</strong>
                  <p className="text-gray-600">Years ending in 4 or 5</p>
                </div>
                <div>
                  <strong className="text-red-700">🔥 Fire:</strong>
                  <p className="text-gray-600">Years ending in 6 or 7</p>
                </div>
                <div>
                  <strong className="text-yellow-700">⛰️ Earth:</strong>
                  <p className="text-gray-600">Years ending in 8 or 9</p>
                </div>
                <div>
                  <strong className="text-gray-700">⚔️ Metal:</strong>
                  <p className="text-gray-600">Years ending in 0 or 1</p>
                </div>
                <div>
                  <strong className="text-blue-700">💧 Water:</strong>
                  <p className="text-gray-600">Years ending in 2 or 3</p>
                </div>
              </div>
            </div>

            {/* Did You Know */}
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-lg shadow-sm border border-yellow-200 p-3 sm:p-4">
              <h3 className="text-base md:text-lg font-semibold text-amber-900 mb-4">Did You Know?</h3>
              <p className="text-xs md:text-sm text-gray-700">
                According to legend, the Jade Emperor organized a race to determine the order of the
                zodiac animals. The clever rat rode on the ox&apos;s back and jumped off at the finish
                line to claim first place!
              </p>
            </div>
          </aside>
        </div>
{/* Related Calculators */}
        <div className="bg-white rounded-xl shadow-sm p-3 sm:p-4 mt-8">
          <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-3 sm:mb-4 md:mb-6">Related Calculators</h2>
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

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="chinese-zodiac-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
