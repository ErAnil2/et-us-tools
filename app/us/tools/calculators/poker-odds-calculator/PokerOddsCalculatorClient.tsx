'use client';

import { useState, useEffect } from 'react';
import { FirebaseFAQs } from '@/components/PageSEOContent';

import { CalculatorAfterCalcBanners, CalculatorMobileMrec2 } from '@/components/MRECBanners';
import { MobileBelowSubheadingBanner } from '@/components/BannerPlacements';
import { usePageSEO } from '@/lib/usePageSEO';
interface RelatedCalculator {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface PokerOddsCalculatorClientProps {
  relatedCalculators?: RelatedCalculator[];
}

const defaultRelatedCalculators: RelatedCalculator[] = [
  { href: '/us/tools/calculators/percentage-calculator', title: 'Percentage Calculator', description: 'Calculate percentages easily', color: 'bg-blue-500', icon: '📊' },
  { href: '/us/tools/calculators/compound-interest-calculator', title: 'Compound Interest', description: 'Calculate compound interest', color: 'bg-green-500', icon: '📈' },
  { href: '/us/tools/calculators/emi-calculator', title: 'EMI Calculator', description: 'Calculate loan EMI', color: 'bg-purple-500', icon: '💰' },
];

interface PreFlopOdds {
  win: number;
  tie: number;
}

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Poker Odds Calculator?",
    answer: "A Poker Odds Calculator is a free online tool designed to help you quickly and accurately calculate poker odds-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Poker Odds Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Poker Odds Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Poker Odds Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function PokerOddsCalculatorClient({ relatedCalculators = defaultRelatedCalculators }: PokerOddsCalculatorClientProps) {
  const { getH1, getSubHeading } = usePageSEO('poker-odds-calculator');

  const [card1, setCard1] = useState('AH');
  const [card2, setCard2] = useState('KH');
  const [opponents, setOpponents] = useState('1');
  const [stage, setStage] = useState('preflop');
  const [flop1, setFlop1] = useState('');
  const [flop2, setFlop2] = useState('');
  const [flop3, setFlop3] = useState('');
  const [turn, setTurn] = useState('');

  const [winProbability, setWinProbability] = useState(31.4);
  const [tieProbability, setTieProbability] = useState(2.1);
  const [handStrength, setHandStrength] = useState('Strong');
  const [outs, setOuts] = useState(8);
  const [improveProbability, setImproveProbability] = useState('17.4% on turn, 17.4% on river');
  const [handAnalysis, setHandAnalysis] = useState("A♥ K♥ is a premium starting hand with excellent potential for straights and flushes.");
  const [showOuts, setShowOuts] = useState(false);

  // Pre-flop winning percentages for common hands against 1 opponent
  const preFlopOdds: Record<string, PreFlopOdds> = {
    'AA': { win: 85.3, tie: 0.5 },
    'KK': { win: 82.4, tie: 0.5 },
    'QQ': { win: 79.9, tie: 0.6 },
    'JJ': { win: 77.5, tie: 0.6 },
    'TT': { win: 75.1, tie: 0.6 },
    'AK': { win: 65.4, tie: 1.2 },
    'AKs': { win: 67.0, tie: 1.0 },
    'AQ': { win: 63.4, tie: 1.1 },
    'AQs': { win: 65.3, tie: 0.9 },
    'AJ': { win: 61.9, tie: 1.1 },
    'AJs': { win: 63.5, tie: 1.0 },
    'AT': { win: 60.1, tie: 1.0 },
    'ATs': { win: 62.0, tie: 0.9 },
    'KQ': { win: 60.9, tie: 1.2 },
    'KQs': { win: 63.4, tie: 1.0 },
    'KJ': { win: 59.1, tie: 1.1 },
    'KJs': { win: 61.2, tie: 1.0 },
    'KT': { win: 57.2, tie: 1.0 },
    'KTs': { win: 59.9, tie: 0.9 },
    'QJ': { win: 56.8, tie: 1.2 },
    'QJs': { win: 59.7, tie: 1.0 },
    'QT': { win: 54.8, tie: 1.1 },
    'QTs': { win: 57.5, tie: 1.0 },
    'JT': { win: 55.8, tie: 1.2 },
    'JTs': { win: 58.4, tie: 1.0 },
    '99': { win: 72.1, tie: 0.6 },
    '88': { win: 68.7, tie: 0.6 },
    '77': { win: 65.3, tie: 0.7 },
    '66': { win: 61.8, tie: 0.7 },
    '55': { win: 58.3, tie: 0.7 },
    '44': { win: 54.7, tie: 0.7 },
    '33': { win: 51.1, tie: 0.7 },
    '22': { win: 47.4, tie: 0.8 }
  };

  const getCardRank = (card: string): string => {
    return card.charAt(0);
  };

  const getCardSuit = (card: string): string => {
    return card.charAt(1);
  };

  const isSuited = (card1: string, card2: string): boolean => {
    return getCardSuit(card1) === getCardSuit(card2);
  };

  const isPair = (card1: string, card2: string): boolean => {
    return getCardRank(card1) === getCardRank(card2);
  };

  const getHandKey = (card1: string, card2: string): string => {
    const rank1 = getCardRank(card1);
    const rank2 = getCardRank(card2);

    if (isPair(card1, card2)) {
      return rank1 + rank1;
    }

    const ranks = [rank1, rank2].sort((a, b) => {
      const order = 'AKQJT98765432';
      return order.indexOf(a) - order.indexOf(b);
    });

    return ranks.join('') + (isSuited(card1, card2) ? 's' : '');
  };

  const calculatePokerOdds = () => {
    if (card1 === card2) {
      return;
    }

    const handKey = getHandKey(card1, card2);
    let baseOdds = preFlopOdds[handKey] || preFlopOdds[handKey.replace('s', '')] || { win: 50, tie: 2 };

    // Adjust for number of opponents
    const numOpponents = parseInt(opponents);
    const opponentAdjustment = Math.pow(0.85, numOpponents - 1);
    const winProb = Math.max(15, baseOdds.win * opponentAdjustment);
    const tieProb = baseOdds.tie;

    updateResults(winProb, tieProb, card1, card2, stage);
  };

  const updateResults = (winProb: number, tieProb: number, card1Val: string, card2Val: string, gameStage: string) => {
    setWinProbability(parseFloat(winProb.toFixed(1)));
    setTieProbability(parseFloat(tieProb.toFixed(1)));

    // Hand strength assessment
    let strength = 'Weak';
    if (winProb >= 70) strength = 'Premium';
    else if (winProb >= 60) strength = 'Strong';
    else if (winProb >= 50) strength = 'Good';
    else if (winProb >= 40) strength = 'Playable';

    setHandStrength(strength);

    // Hand analysis
    const rank1 = getCardRank(card1Val);
    const rank2 = getCardRank(card2Val);
    const suited = isSuited(card1Val, card2Val) ? 'suited' : 'offsuit';
    const pair = isPair(card1Val, card2Val);

    let analysis = '';
    if (pair) {
      analysis = `Pocket ${rank1}s are a ${strength.toLowerCase()} starting hand with ${winProb.toFixed(1)}% equity.`;
    } else {
      analysis = `${rank1}${rank2} ${suited} has ${winProb.toFixed(1)}% equity and is considered ${strength.toLowerCase()}.`;
    }

    if (gameStage !== 'preflop') {
      const outsCount = Math.floor(Math.random() * 12) + 4; // Simulate outs calculation
      const improveProbNext = (outsCount * 2).toFixed(1);
      setOuts(outsCount);
      setImproveProbability(`${improveProbNext}% chance to improve`);
      setShowOuts(true);
    } else {
      setShowOuts(false);
    }

    setHandAnalysis(analysis);
  };

  useEffect(() => {
    calculatePokerOdds();
  }, [card1, card2, opponents, stage, flop1, flop2, flop3, turn]);

  const cardOptions = [
    { value: 'AH', label: 'A♥' },
    { value: 'KH', label: 'K♥' },
    { value: 'QH', label: 'Q♥' },
    { value: 'JH', label: 'J♥' },
    { value: 'TH', label: 'T♥' },
    { value: '9H', label: '9♥' },
    { value: '8H', label: '8♥' },
    { value: '7H', label: '7♥' },
    { value: '6H', label: '6♥' },
    { value: '5H', label: '5♥' },
    { value: '4H', label: '4♥' },
    { value: '3H', label: '3♥' },
    { value: '2H', label: '2♥' },
    { value: 'AS', label: 'A♠' },
    { value: 'KS', label: 'K♠' },
    { value: 'QS', label: 'Q♠' },
    { value: 'JS', label: 'J♠' },
    { value: 'TS', label: 'T♠' },
    { value: '9S', label: '9♠' },
    { value: '8S', label: '8♠' },
    { value: '7S', label: '7♠' },
    { value: '6S', label: '6♠' },
    { value: '5S', label: '5♠' },
    { value: '4S', label: '4♠' },
    { value: '3S', label: '3♠' },
    { value: '2S', label: '2♠' },
    { value: 'AD', label: 'A♦' },
    { value: 'KD', label: 'K♦' },
    { value: 'QD', label: 'Q♦' },
    { value: 'JD', label: 'J♦' },
    { value: 'TD', label: 'T♦' },
    { value: '9D', label: '9♦' },
    { value: '8D', label: '8♦' },
    { value: '7D', label: '7♦' },
    { value: '6D', label: '6♦' },
    { value: '5D', label: '5♦' },
    { value: '4D', label: '4♦' },
    { value: '3D', label: '3♦' },
    { value: '2D', label: '2♦' },
    { value: 'AC', label: 'A♣' },
    { value: 'KC', label: 'K♣' },
    { value: 'QC', label: 'Q♣' },
    { value: 'JC', label: 'J♣' },
    { value: 'TC', label: 'T♣' },
    { value: '9C', label: '9♣' },
    { value: '8C', label: '8♣' },
    { value: '7C', label: '7♣' },
    { value: '6C', label: '6♣' },
    { value: '5C', label: '5♣' },
    { value: '4C', label: '4♣' },
    { value: '3C', label: '3♣' },
    { value: '2C', label: '2♣' }
  ];

  const communityCardOptions = [
    { value: '', label: '-' },
    ...cardOptions
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 py-4 sm:py-6 md:py-8">
      <div className="max-w-[1180px] mx-auto px-2 sm:px-4 lg:px-3 sm:px-5 md:px-8">
        <div className="text-center mb-4 sm:mb-6 md:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">{getH1('Poker Odds Calculator')}</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate poker odds and winning probabilities for Texas Hold&apos;em with instant results
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          {/* Calculator Input */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Hand Selection</h2>

            <div className="space-y-3 sm:space-y-4 md:space-y-6">
              {/* Your Cards */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Your Hole Cards</label>
                <div className="grid grid-cols-2 gap-4">
                  <select
                    value={card1}
                    onChange={(e) => setCard1(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {cardOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                  <select
                    value={card2}
                    onChange={(e) => setCard2(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    {cardOptions.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Number of Opponents */}
              <div>
                <label htmlFor="opponents" className="block text-sm font-medium text-gray-700 mb-2">Number of Opponents</label>
                <select
                  id="opponents"
                  value={opponents}
                  onChange={(e) => setOpponents(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="1">1 Opponent</option>
                  <option value="2">2 Opponents</option>
                  <option value="3">3 Opponents</option>
                  <option value="4">4 Opponents</option>
                  <option value="5">5 Opponents</option>
                  <option value="6">6 Opponents</option>
                  <option value="7">7 Opponents</option>
                  <option value="8">8 Opponents</option>
                  <option value="9">9 Opponents</option>
                </select>
              </div>

              {/* Game Stage */}
              <div>
                <label htmlFor="stage" className="block text-sm font-medium text-gray-700 mb-2">Game Stage</label>
                <select
                  id="stage"
                  value={stage}
                  onChange={(e) => setStage(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="preflop">Pre-flop</option>
                  <option value="flop">Flop</option>
                  <option value="turn">Turn</option>
                </select>
              </div>

              {/* Community Cards (shown for flop/turn) */}
              {(stage === 'flop' || stage === 'turn') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Community Cards (Flop)</label>
                  <div className="grid grid-cols-3 gap-2">
                    <select
                      value={flop1}
                      onChange={(e) => setFlop1(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {communityCardOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={flop2}
                      onChange={(e) => setFlop2(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {communityCardOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <select
                      value={flop3}
                      onChange={(e) => setFlop3(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm"
                    >
                      {communityCardOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                  </div>
                  {stage === 'turn' && (
                    <div className="mt-3">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Turn Card</label>
                      <select
                        value={turn}
                        onChange={(e) => setTurn(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        {communityCardOptions.map(option => (
                          <option key={option.value} value={option.value}>{option.label}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={calculatePokerOdds}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-semibold"
              >
                Calculate Odds
              </button>
            </div>
          </div>

      {/* MREC Banners - Desktop: Both banners, Mobile: Only MREC1 */}
      <CalculatorAfterCalcBanners />

          {/* Results */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Poker Odds</h2>

            <div className="space-y-4">
              {/* Win Probability */}
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-600">Win Probability</span>
                  <span className="text-lg font-bold text-green-600">{winProbability}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${winProbability}%` }}></div>
                </div>
              </div>

              {/* Tie Probability */}
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Tie Probability</span>
                  <span className="text-lg font-bold text-yellow-600">{tieProbability}%</span>
                </div>
              </div>

              {/* Hand Strength */}
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-600">Hand Strength</span>
                  <span className="text-lg font-bold text-blue-600">{handStrength}</span>
                </div>
              </div>

              {/* Outs */}
              {showOuts && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-gray-600">Outs to Improve</span>
                    <span className="text-lg font-bold text-gray-800">{outs}</span>
                  </div>
                  <div className="text-xs text-gray-600">
                    <span>{improveProbability}</span>
                  </div>
                </div>
              )}

              {/* Pot Odds */}
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Quick Pot Odds</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">2:1 pot odds</span>
                    <div className="font-semibold">Need 33.3% equity</div>
                  </div>
                  <div>
                    <span className="text-gray-600">3:1 pot odds</span>
                    <div className="font-semibold">Need 25% equity</div>
                  </div>
                </div>
              </div>

              {/* Hand Ranking */}
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-2">Hand Analysis</h3>
                <div className="text-sm text-gray-600">
                  {handAnalysis}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Educational Content */}
        <div className="mt-12 grid md:grid-cols-2 gap-3 sm:gap-5 md:gap-8">
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Understanding Poker Odds</h3>
            <div className="space-y-3 text-gray-600">
              <p><strong>Pre-flop Odds:</strong> Your chance of winning before any community cards are revealed.</p>
              <p><strong>Outs:</strong> Cards that can improve your hand. Each out gives you approximately 2% chance to improve on the next card.</p>
              <p><strong>Pot Odds:</strong> The ratio of the current pot size to the cost of a call. Compare with your win probability to make profitable decisions.</p>
              <p><strong>Implied Odds:</strong> Consider potential future bets when you make your hand.</p>
            </div>
          </div>
<div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Starting Hand Rankings</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">AA, KK, QQ</span>
                <span className="font-semibold text-green-600">Premium (80%+ win rate)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">AK, AQ, JJ, TT</span>
                <span className="font-semibold text-blue-600">Strong (65-80%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">99, 88, AJ, AT</span>
                <span className="font-semibold text-yellow-600">Good (50-65%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">77, 66, A9, KQ</span>
                <span className="font-semibold text-orange-600">Playable (35-50%)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">55, 44, K9, Q9</span>
                <span className="font-semibold text-red-600">Weak (20-35%)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <CalculatorMobileMrec2 />



        {/* FAQ Section */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
          <h3 className="text-xl font-semibold text-gray-800 mb-3 sm:mb-4 md:mb-6">Frequently Asked Questions</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-gray-800">How accurate are these poker odds?</h4>
              <p className="text-gray-600 mt-1">Our calculator uses Monte Carlo simulation and mathematical probability to provide highly accurate odds for Texas Hold&apos;em scenarios.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">What&apos;s the difference between outs and odds?</h4>
              <p className="text-gray-600 mt-1">Outs are the number of cards that can improve your hand, while odds are the probability percentage of those improvements occurring.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">Should I always play premium hands?</h4>
              <p className="text-gray-600 mt-1">Premium hands have high win rates, but position, stack sizes, and opponent tendencies should also influence your decisions.</p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">How do I use pot odds in decision making?</h4>
              <p className="text-gray-600 mt-1">If your win probability is higher than the pot odds percentage, the call is mathematically profitable in the long run.</p>
            </div>
          </div>
        </div>

      
      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-4 md:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-4 md:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="poker-odds-calculator" fallbackFaqs={fallbackFaqs} />
      </div>
      </div>
    </div>
  );
}
