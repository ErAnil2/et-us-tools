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

interface Props {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '%' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface ZodiacSign {
  name: string;
  symbol: string;
  dates: string;
  element: string;
}

interface ZodiacSigns {
  [key: string]: ZodiacSign;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Love Compatibility Calculator?",
    answer: "A Love Compatibility Calculator is a free online tool designed to help you quickly and accurately calculate love compatibility-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Love Compatibility Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Love Compatibility Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Love Compatibility Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LoveCompatibilityCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: Props) {
  // State for form inputs
  const { getH1, getSubHeading } = usePageSEO('love-compatibility-calculator');

  const [person1Name, setPerson1Name] = useState('Alex');
  const [person2Name, setPerson2Name] = useState('Jordan');
  const [person1Date, setPerson1Date] = useState('1995-06-15');
  const [person2Date, setPerson2Date] = useState('1993-09-22');
  const [person1Personality, setPerson1Personality] = useState('introvert');
  const [person2Personality, setPerson2Personality] = useState('extrovert');
  const [person1Style, setPerson1Style] = useState('practical');
  const [person2Style, setPerson2Style] = useState('romantic');
  const [communicationMatch, setCommunicationMatch] = useState('good');
  const [goalsAlignment, setGoalsAlignment] = useState('highly-aligned');
  const [relationshipLength, setRelationshipLength] = useState('year');

  // State for results
  const [compatibilityScore, setCompatibilityScore] = useState(87);
  const [compatibilityLevel, setCompatibilityLevel] = useState('Great Match!');
  const [levelColor, setLevelColor] = useState('text-pink-600');
  const [strengths, setStrengths] = useState<string[]>([]);
  const [challenges, setChallenges] = useState<string[]>([]);
  const [personalizedAdvice, setPersonalizedAdvice] = useState('');
  const [zodiac1, setZodiac1] = useState('gemini');
  const [zodiac2, setZodiac2] = useState('virgo');
  const [zodiacCompatibility, setZodiacCompatibility] = useState('');

  // Zodiac signs data
  const zodiacSigns: ZodiacSigns = {
    'aries': { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', element: 'fire' },
    'taurus': { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', element: 'earth' },
    'gemini': { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', element: 'air' },
    'cancer': { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', element: 'water' },
    'leo': { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', element: 'fire' },
    'virgo': { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', element: 'earth' },
    'libra': { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', element: 'air' },
    'scorpio': { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', element: 'water' },
    'sagittarius': { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', element: 'fire' },
    'capricorn': { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', element: 'earth' },
    'aquarius': { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', element: 'air' },
    'pisces': { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', element: 'water' }
  };

  useEffect(() => {
    calculateCompatibility();
  }, [person1Name, person2Name, person1Date, person2Date, person1Personality, person2Personality,
      person1Style, person2Style, communicationMatch, goalsAlignment, relationshipLength]);

  const getZodiacSign = (dateString: string): string => {
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();

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

    return 'gemini'; // fallback
  };

  const getZodiacCompatibility = (element1: string, element2: string): string => {
    const compatibilityMap: { [key: string]: string } = {
      'fire-fire': 'share passionate energy and mutual understanding.',
      'fire-earth': 'can balance passion with stability when they appreciate differences.',
      'fire-air': 'create exciting dynamics with great communication potential.',
      'fire-water': 'can complement each other with patience and emotional understanding.',
      'earth-earth': 'build solid, practical relationships with shared values.',
      'earth-air': 'balance practicality with creativity through mutual respect.',
      'earth-water': 'create nurturing, stable bonds with deep emotional connection.',
      'air-air': 'connect through excellent communication and shared intellectual interests.',
      'air-water': 'can blend logic with emotion for well-rounded relationships.',
      'water-water': 'share deep emotional understanding and intuitive connection.'
    };

    const key = element1 <= element2 ? `${element1}-${element2}` : `${element2}-${element1}`;
    return compatibilityMap[key] || 'have unique potential that depends on individual personalities.';
  };

  const generateStrengths = (p1: string, p2: string, s1: string, s2: string, comm: string, goals: string): string[] => {
    const strengths: string[] = [];

    // Personality strengths
    if (p1 === p2) {
      strengths.push(`Both ${p1}s - you understand each other's energy levels`);
    } else if ((p1 === 'extrovert' && p2 === 'introvert') || (p1 === 'introvert' && p2 === 'extrovert')) {
      strengths.push('Complementary personalities create perfect balance');
    }

    // Style strengths
    if (s1 === s2) {
      strengths.push(`Shared ${s1} approach to relationships`);
    } else {
      const combinations: { [key: string]: string } = {
        'romantic-practical': 'Romance meets practicality - a grounded yet passionate connection',
        'practical-romantic': 'Practicality meets romance - a grounded yet passionate connection',
        'adventurous-traditional': 'Adventure balanced with stability creates exciting security',
        'traditional-adventurous': 'Stability balanced with adventure creates secure excitement'
      };
      const combo = combinations[`${s1}-${s2}`];
      if (combo) strengths.push(combo);
    }

    // Communication strengths
    if (comm === 'excellent') {
      strengths.push('Excellent communication creates deep understanding');
    } else if (comm === 'good') {
      strengths.push('Good communication foundation with room to grow');
    }

    // Goals alignment
    if (goals === 'highly-aligned') {
      strengths.push('Shared life vision provides strong relationship foundation');
    } else if (goals === 'mostly-aligned') {
      strengths.push('Similar life goals create mutual support and motivation');
    }

    // Default strengths if none generated
    if (strengths.length === 0) {
      strengths.push('Every relationship has unique potential for growth');
      strengths.push('Differences can become strengths with understanding');
    }

    return strengths.slice(0, 4); // Limit to 4 strengths
  };

  const generateChallenges = (p1: string, p2: string, s1: string, s2: string, comm: string, goals: string): string[] => {
    const challenges: string[] = [];

    // Communication challenges
    if (comm === 'challenging') {
      challenges.push('Different communication styles need patience and practice');
    } else if (comm === 'fair') {
      challenges.push('Some communication differences require understanding');
    }

    // Goals challenges
    if (goals === 'different-goals') {
      challenges.push('Different life goals need open discussion and compromise');
    } else if (goals === 'somewhat-aligned') {
      challenges.push('Some goal differences require finding middle ground');
    }

    // Style challenges
    if (s1 !== s2) {
      challenges.push('Different relationship styles need mutual appreciation');
    }

    // Personality challenges
    if (p1 === p2 && p1 === 'introvert') {
      challenges.push('Both introverts should make effort for social activities together');
    } else if (p1 === p2 && p1 === 'extrovert') {
      challenges.push('Both extroverts should ensure quiet intimate time together');
    }

    // Default challenges
    if (challenges.length === 0) {
      challenges.push('Remember to maintain individual identities within the relationship');
      challenges.push('Regular check-ins about relationship satisfaction are important');
    }

    return challenges.slice(0, 3); // Limit to 3 challenges
  };

  const generateAdvice = (score: number, p1: string, p2: string, s1: string, s2: string): string => {
    if (score >= 80) {
      return `You two have amazing compatibility! Focus on maintaining your strong connection through regular quality time and open communication. Your ${p1}-${p2} personality combination and relationship styles complement each other beautifully.`;
    } else if (score >= 65) {
      return `You have great potential as a couple! Embrace your differences as strengths and work on understanding each other's perspectives. Your relationship can flourish with patience and mutual respect.`;
    } else if (score >= 50) {
      return `Your relationship has good potential but may require more effort and understanding. Focus on building stronger communication and finding common ground in your values and goals.`;
    } else {
      return `While your compatibility score is lower, remember that successful relationships are built on commitment, communication, and mutual growth. With dedication, any two people can build a strong connection.`;
    }
  };

  const calculateCompatibility = () => {
    // Calculate base compatibility score
    let score = 50; // Base score

    // Personality compatibility
    if (person1Personality === person2Personality) {
      score += 10; // Same personality types
    } else if (
      (person1Personality === 'extrovert' && person2Personality === 'introvert') ||
      (person1Personality === 'introvert' && person2Personality === 'extrovert')
    ) {
      score += 15; // Complementary personalities
    } else {
      score += 12; // Ambivert combinations
    }

    // Relationship style compatibility
    const styleCompatibility: { [key: string]: { [key: string]: number } } = {
      'romantic': { 'romantic': 15, 'practical': 8, 'adventurous': 12, 'traditional': 10 },
      'practical': { 'romantic': 8, 'practical': 15, 'adventurous': 6, 'traditional': 12 },
      'adventurous': { 'romantic': 12, 'practical': 6, 'adventurous': 15, 'traditional': 5 },
      'traditional': { 'romantic': 10, 'practical': 12, 'adventurous': 5, 'traditional': 15 }
    };
    score += styleCompatibility[person1Style][person2Style];

    // Communication match bonus
    const commBonus: { [key: string]: number } = {
      'excellent': 15,
      'good': 10,
      'fair': 5,
      'challenging': 0
    };
    score += commBonus[communicationMatch];

    // Goals alignment bonus
    const goalsBonus: { [key: string]: number } = {
      'highly-aligned': 15,
      'mostly-aligned': 10,
      'somewhat-aligned': 5,
      'different-goals': -5
    };
    score += goalsBonus[goalsAlignment];

    // Relationship length bonus (experience together)
    const lengthBonus: { [key: string]: number } = {
      'new': 0,
      'few-months': 2,
      'year': 5,
      'long-term': 8,
      'married': 10,
      'crush': -5
    };
    score += lengthBonus[relationshipLength];

    // Add some randomness for entertainment (±5 points)
    const nameHash = (person1Name + person2Name).split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    score += (nameHash % 11) - 5;

    // Ensure score is within reasonable bounds
    score = Math.max(15, Math.min(98, score));

    // Get zodiac signs
    const z1 = getZodiacSign(person1Date);
    const z2 = getZodiacSign(person2Date);
    setZodiac1(z1);
    setZodiac2(z2);

    // Update results
    updateResults(score, z1, z2);
  };

  const updateResults = (score: number, z1: string, z2: string) => {
    const roundedScore = Math.round(score);
    setCompatibilityScore(roundedScore);

    // Determine compatibility level
    let level: string;
    let color: string;
    if (score >= 85) {
      level = 'Soulmates! 💖';
      color = 'text-pink-600';
    } else if (score >= 75) {
      level = 'Amazing Match! 💕';
      color = 'text-red-500';
    } else if (score >= 65) {
      level = 'Great Match! ❤️';
      color = 'text-red-600';
    } else if (score >= 55) {
      level = 'Good Potential 💛';
      color = 'text-yellow-600';
    } else if (score >= 45) {
      level = 'Worth Exploring 💚';
      color = 'text-green-600';
    } else {
      level = 'Challenging Match 💙';
      color = 'text-blue-600';
    }
    setCompatibilityLevel(level);
    setLevelColor(color);

    // Update strengths and challenges
    const newStrengths = generateStrengths(person1Personality, person2Personality, person1Style, person2Style, communicationMatch, goalsAlignment);
    const newChallenges = generateChallenges(person1Personality, person2Personality, person1Style, person2Style, communicationMatch, goalsAlignment);
    setStrengths(newStrengths);
    setChallenges(newChallenges);

    // Update personalized advice
    const advice = generateAdvice(score, person1Personality, person2Personality, person1Style, person2Style);
    setPersonalizedAdvice(advice);

    // Update zodiac compatibility
    const sign1 = zodiacSigns[z1];
    const sign2 = zodiacSigns[z2];
    const compatibility = getZodiacCompatibility(sign1.element, sign2.element);
    setZodiacCompatibility(`${sign1.name} and ${sign2.name} ${compatibility}`);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 py-8 sm:py-12">
      <div className="container mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 max-w-[1180px]">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">{getH1('Love Compatibility Calculator')}</h1>
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover your relationship compatibility with fun personality analysis!
            Enter your details and see how well you match with your partner or crush.
          </p>
          <div className="mt-4 text-5xl animate-pulse">💕</div>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Enter Your Information</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Person 1 */}
            <div className="p-3 sm:p-4 md:p-6 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-medium text-pink-800 mb-4">👤 Your Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Your Name</label>
                  <input
                    type="text"
                    value={person1Name}
                    onChange={(e) => setPerson1Name(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={person1Date}
                    onChange={(e) => setPerson1Date(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                  <select
                    value={person1Personality}
                    onChange={(e) => setPerson1Personality(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="extrovert">Extrovert (Outgoing & Social)</option>
                    <option value="introvert">Introvert (Thoughtful & Reserved)</option>
                    <option value="ambivert">Ambivert (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Style</label>
                  <select
                    value={person1Style}
                    onChange={(e) => setPerson1Style(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="romantic">Romantic & Affectionate</option>
                    <option value="practical">Practical & Logical</option>
                    <option value="adventurous">Adventurous & Spontaneous</option>
                    <option value="traditional">Traditional & Stable</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Person 2 */}
            <div className="p-3 sm:p-4 md:p-6 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-medium text-blue-800 mb-4">💝 Partner's Details</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Partner's Name</label>
                  <input
                    type="text"
                    value={person2Name}
                    onChange={(e) => setPerson2Name(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter partner's name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Birth Date</label>
                  <input
                    type="date"
                    value={person2Date}
                    onChange={(e) => setPerson2Date(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Personality Type</label>
                  <select
                    value={person2Personality}
                    onChange={(e) => setPerson2Personality(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="extrovert">Extrovert (Outgoing & Social)</option>
                    <option value="introvert">Introvert (Thoughtful & Reserved)</option>
                    <option value="ambivert">Ambivert (Balanced)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Style</label>
                  <select
                    value={person2Style}
                    onChange={(e) => setPerson2Style(e.target.value)}
                    className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="romantic">Romantic & Affectionate</option>
                    <option value="practical">Practical & Logical</option>
                    <option value="adventurous">Adventurous & Spontaneous</option>
                    <option value="traditional">Traditional & Stable</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Compatibility Factors */}
          <div className="mt-8 p-3 sm:p-4 md:p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-800 mb-4">💫 Shared Interests & Values</h3>

            <div className="grid md:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Communication Style Match</label>
                <select
                  value={communicationMatch}
                  onChange={(e) => setCommunicationMatch(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="excellent">Excellent - Very similar styles</option>
                  <option value="good">Good - Complementary styles</option>
                  <option value="fair">Fair - Some differences</option>
                  <option value="challenging">Challenging - Very different</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Shared Life Goals</label>
                <select
                  value={goalsAlignment}
                  onChange={(e) => setGoalsAlignment(e.target.value)}
                  className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="highly-aligned">Highly Aligned</option>
                  <option value="mostly-aligned">Mostly Aligned</option>
                  <option value="somewhat-aligned">Somewhat Aligned</option>
                  <option value="different-goals">Different Goals</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Relationship Length (Optional)</label>
              <select
                value={relationshipLength}
                onChange={(e) => setRelationshipLength(e.target.value)}
                className="w-full px-2 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              >
                <option value="new">Just started dating</option>
                <option value="few-months">A few months</option>
                <option value="year">About a year</option>
                <option value="long-term">Long-term (2+ years)</option>
                <option value="married">Married/Engaged</option>
                <option value="crush">Just a crush</option>
              </select>
            </div>
          </div>

          {/* Calculate Button */}
          <div className="text-center mt-8">
            <button
              onClick={calculateCompatibility}
              className="px-3 sm:px-5 md:px-8 py-4 bg-gradient-to-r from-pink-500 to-red-500 text-white text-lg font-semibold rounded-lg hover:from-pink-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              💖 Calculate Our Compatibility
            </button>
          </div>
        </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

        {/* Results Section */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Your Love Compatibility Report</h2>

          {/* Compatibility Score */}
          <div className="text-center mb-4 sm:mb-6 md:mb-8">
            <div className="inline-block p-3 sm:p-5 md:p-8 bg-gradient-to-r from-pink-100 to-red-100 rounded-full">
              <div className="text-6xl font-bold text-pink-600">{compatibilityScore}%</div>
              <div className="text-lg text-gray-600 mt-2">Compatibility Score</div>
            </div>

            {/* Progress Bar */}
            <div className="mt-6 max-w-md mx-auto">
              <div className="bg-gray-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-pink-500 to-red-500 h-full rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${compatibilityScore}%` }}
                ></div>
              </div>
            </div>

            <div className="mt-4">
              <div className={`text-2xl font-semibold ${levelColor}`}>{compatibilityLevel}</div>
              <div className="text-gray-600">{person1Name} & {person2Name}</div>
            </div>
          </div>

          {/* Detailed Analysis */}
          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            {/* Strengths */}
            <div className="p-3 sm:p-4 md:p-6 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-medium text-green-800 mb-4">💚 Relationship Strengths</h3>
              <ul className="space-y-2 text-sm">
                {strengths.map((strength, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-green-500 font-bold">•</span>
                    <span>{strength}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Areas to Work On */}
            <div className="p-3 sm:p-4 md:p-6 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-medium text-yellow-800 mb-4">💛 Growth Opportunities</h3>
              <ul className="space-y-2 text-sm">
                {challenges.map((challenge, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-yellow-500 font-bold">•</span>
                    <span>{challenge}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Personalized Advice */}
          <div className="mt-8 p-3 sm:p-4 md:p-6 bg-purple-50 rounded-lg border border-purple-200">
            <h3 className="text-lg font-medium text-purple-800 mb-3">💜 Personalized Relationship Advice</h3>
            <div className="text-sm text-purple-700">
              {personalizedAdvice}
            </div>
          </div>

          {/* Zodiac Compatibility */}
          <div className="mt-8 p-3 sm:p-4 md:p-6 bg-indigo-50 rounded-lg border border-indigo-200">
            <h3 className="text-lg font-medium text-indigo-800 mb-3">⭐ Zodiac Insights</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl mb-2">{zodiacSigns[zodiac1].symbol}</div>
                <div className="font-medium">{zodiacSigns[zodiac1].name}</div>
                <div className="text-xs text-gray-600">{zodiacSigns[zodiac1].dates}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">{zodiacSigns[zodiac2].symbol}</div>
                <div className="font-medium">{zodiacSigns[zodiac2].name}</div>
                <div className="text-xs text-gray-600">{zodiacSigns[zodiac2].dates}</div>
              </div>
            </div>
            <div className="mt-4 text-sm text-indigo-700 text-center">
              {zodiacCompatibility}
            </div>
          </div>
        </div>

        {/* Compatibility Tips */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6 md:mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">💝 Relationship Success Tips</h2>

          <div className="grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">🗣️ Communication</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Practice active listening without judgment</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Express appreciation regularly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Share your feelings openly and honestly</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-pink-500 font-bold">•</span>
                  <span>Ask questions to understand their perspective</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-800 mb-4">❤️ Building Connection</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Plan regular quality time together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Try new activities and experiences</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Respect each other's independence</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-red-500 font-bold">•</span>
                  <span>Support each other's goals and dreams</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
{/* Fun Facts */}
        <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">💕 Love & Relationship Fun Facts</h2>

          <div className="grid md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="text-center p-4 bg-pink-50 rounded-lg">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">🧠</div>
              <h3 className="font-medium text-gray-800 mb-2">Psychology</h3>
              <p className="text-sm text-gray-600">It takes 90 seconds to 4 minutes to determine if you're attracted to someone</p>
            </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">💗</div>
              <h3 className="font-medium text-gray-800 mb-2">Chemistry</h3>
              <p className="text-sm text-gray-600">The "honeymoon phase" typically lasts 12-24 months due to brain chemistry</p>
            </div>

            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-xl sm:text-2xl md:text-3xl mb-2">👥</div>
              <h3 className="font-medium text-gray-800 mb-2">Connection</h3>
              <p className="text-sm text-gray-600">Couples who are friends first have relationships that last 70% longer</p>
            </div>
          </div>

          <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
            <h3 className="text-lg font-medium text-yellow-800 mb-2">🌟 Remember</h3>
            <p className="text-sm text-yellow-700">
              This calculator is for entertainment purposes! Real compatibility depends on communication,
              shared values, mutual respect, and genuine care for each other. Every relationship is unique! 💕
            </p>
          </div>
        </div>
      </div>

      {/* MREC Advertisement Banners */}
      {/* Enhanced Related Calculators */}
      <div className="container mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8 max-w-[1180px] mt-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-3 sm:mb-4 md:mb-6">Related Math Calculators</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
          {relatedCalculators.map((calc, index) => (
            <Link key={index} href={calc.href} className="block">
              <div className={`${calc.color} text-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300`}>
                <h3 className="text-lg font-semibold mb-2">{calc.title}</h3>
                <p className="text-sm opacity-90">{calc.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="love-compatibility-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
    </main>
  );
}
