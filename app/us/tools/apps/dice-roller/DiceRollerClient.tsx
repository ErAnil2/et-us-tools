'use client';

import { MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';
import { useState } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';

const fallbackFaqs = [
  {
    id: '1',
    question: 'Is this dice roller truly random?',
    answer: 'Yes! Our dice roller uses JavaScript\'s cryptographic random number generator to ensure fair and unbiased results. Each roll is completely independent with equal probability for all outcomes.',
    order: 1
  },
  {
    id: '2',
    question: 'What dice types can I roll?',
    answer: 'You can roll D4, D6, D8, D10, D12, D20, and D100 dice. We also support custom-sided dice up to 1000 sides, plus a coin flip option for heads or tails.',
    order: 2
  },
  {
    id: '3',
    question: 'Can I roll multiple dice at once?',
    answer: 'Absolutely! You can roll up to 20 dice simultaneously. The tool shows each individual die result as well as the total sum with any modifiers applied.',
    order: 3
  },
  {
    id: '4',
    question: 'What are dice modifiers?',
    answer: 'Modifiers let you add or subtract a number from your total roll. For example, in D&D you might roll 1d20+5 for a skill check, where +5 is your skill modifier.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I use this for D&D and other RPGs?',
    answer: 'This dice roller is perfect for tabletop RPGs like Dungeons & Dragons, Pathfinder, and more. Use the D&D presets for common rolls like 4d6 for stats or 1d20+5 for skill checks.',
    order: 5
  },
  {
    id: '6',
    question: 'Is my roll history saved?',
    answer: 'Yes, your roll history shows the last 20 rolls during your session. You can see individual dice results, totals, and timestamps. Use the Clear button to reset the history.',
    order: 6
  }
];

const relatedTools = [
  { name: 'Coin Flip', path: '/us/tools/apps/coin-flip', icon: '🪙', color: 'bg-yellow-100' },
  { name: 'Random Number', path: '/us/tools/apps/random-number-generator', icon: '🔢', color: 'bg-blue-100' },
  { name: 'Spin Wheel', path: '/us/tools/apps/spin-wheel', icon: '🎡', color: 'bg-purple-100' },
  { name: '2048 Game', path: '/us/tools/games/2048', icon: '🎮', color: 'bg-orange-100' },
];

export default function DiceRollerClient() {
  const [diceCount, setDiceCount] = useState(1);
  const [diceType, setDiceType] = useState('6');
  const [customSides, setCustomSides] = useState(6);
  const [showCustomSides, setShowCustomSides] = useState(false);
  const [modifierType, setModifierType] = useState('+');
  const [modifierValue, setModifierValue] = useState(0);
  const [currentResult, setCurrentResult] = useState<any>(null);
  const [rolls, setRolls] = useState<number[]>([]);
  const [rollHistory, setRollHistory] = useState<any[]>([]);
  const [statistics, setStatistics] = useState({
    totalRolls: 0,
    sum: 0,
    highest: 0,
    lowest: Infinity
  });

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('dice-roller');

  const webAppSchema = generateWebAppSchema(
    'Dice Roller - Free Online Virtual Dice for D&D & Board Games',
    'Free online dice roller for board games, D&D, and RPGs. Roll multiple dice types (D4, D6, D8, D10, D12, D20, D100) with modifiers and track roll history.',
    'https://economictimes.indiatimes.com/us/tools/apps/dice-roller',
    'GameApplication'
  );

  const getDiceEmoji = (value: number, sides: number) => {
    if (sides === 6 && value >= 1 && value <= 6) {
      const diceEmojis = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];
      return diceEmojis[value - 1];
    }
    return '🎲';
  };

  const rollDice = () => {
    const count = diceCount;
    const sides = diceType === 'custom' ? customSides : parseInt(diceType);
    const modifier = modifierType === '+' ? modifierValue : -modifierValue;

    const newRolls: number[] = [];
    for (let i = 0; i < count; i++) {
      newRolls.push(Math.floor(Math.random() * sides) + 1);
    }

    const sum = newRolls.reduce((a, b) => a + b, 0);
    const finalResult = sum + modifier;

    setRolls(newRolls);
    setCurrentResult({
      rolls: newRolls,
      sum,
      finalResult,
      sides,
      modifier,
      modifierType
    });

    addToHistory(newRolls, sides, finalResult, modifierType, modifierValue);
    updateStatistics(finalResult);
  };

  const quickRoll = (sides: number) => {
    const roll = Math.floor(Math.random() * sides) + 1;

    setCurrentResult({
      rolls: [roll],
      sum: roll,
      finalResult: roll,
      sides,
      modifier: 0,
      quick: true
    });

    addToHistory([roll], sides, roll);
    updateStatistics(roll);
    setRolls([]);
  };

  const rollCoins = () => {
    const result = Math.random() < 0.5 ? 'Heads' : 'Tails';
    const emoji = result === 'Heads' ? '👑' : '🪙';

    setCurrentResult({
      coin: true,
      result,
      emoji
    });

    const historyItem = {
      type: 'coin',
      result,
      time: new Date().toLocaleTimeString()
    };

    setRollHistory(prev => [historyItem, ...prev].slice(0, 20));
    setRolls([]);
  };

  const rollPreset = (preset: string) => {
    const match = preset.match(/(\d+)d(\d+)([+-]\d+)?/);
    if (!match) return;

    const count = parseInt(match[1]);
    const sides = parseInt(match[2]);
    const modifier = match[3] ? parseInt(match[3]) : 0;

    setDiceCount(count);
    setDiceType(sides.toString());

    if (modifier > 0) {
      setModifierType('+');
      setModifierValue(modifier);
    } else if (modifier < 0) {
      setModifierType('-');
      setModifierValue(Math.abs(modifier));
    } else {
      setModifierValue(0);
    }

    setTimeout(() => rollDice(), 100);
  };

  const addToHistory = (rolls: number[], sides: number, finalResult: number, modType: string = '+', modVal: number = 0) => {
    const historyItem = {
      type: 'dice',
      rolls,
      sides,
      finalResult,
      modifierType: modType,
      modifierValue: modVal,
      time: new Date().toLocaleTimeString()
    };

    setRollHistory(prev => [historyItem, ...prev].slice(0, 20));
  };

  const updateStatistics = (result: number) => {
    setStatistics(prev => ({
      totalRolls: prev.totalRolls + 1,
      sum: prev.sum + result,
      highest: Math.max(prev.highest, result),
      lowest: Math.min(prev.lowest, result)
    }));
  };

  const clearHistory = () => {
    setRollHistory([]);
    setStatistics({
      totalRolls: 0,
      sum: 0,
      highest: 0,
      lowest: Infinity
    });
  };

  const adjustDiceCount = (change: number) => {
    setDiceCount(prev => Math.max(1, Math.min(20, prev + change)));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Schema.org JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-red-100 to-orange-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🎲</span>
          <span className="text-red-600 font-semibold">Dice Roller</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent mb-4">
          {getH1('Virtual Dice Roller')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Roll virtual dice for board games, D&D campaigns, or quick decisions. Choose from various dice types and roll multiple dice at once.')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Stats Bar */}
      <div className="mb-6">
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{statistics.totalRolls}</div>
            <div className="text-sm opacity-80">Total Rolls</div>
          </div>
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{statistics.totalRolls > 0 ? (statistics.sum / statistics.totalRolls).toFixed(1) : '0'}</div>
            <div className="text-sm opacity-80">Average</div>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{statistics.highest || 0}</div>
            <div className="text-sm opacity-80">Highest</div>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-4 text-center text-white">
            <div className="text-2xl font-bold">{statistics.lowest === Infinity ? 0 : statistics.lowest}</div>
            <div className="text-sm opacity-80">Lowest</div>
          </div>
        </div>
      </div>

      {/* Quick Roll Buttons */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Quick Roll</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button onClick={() => quickRoll(6)} className="bg-white border-2 border-red-200 rounded-xl p-4 text-center hover:border-red-400 hover:shadow-md transition-all group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">⚀</span>
            <div className="font-semibold text-gray-800">D6</div>
            <div className="text-sm text-gray-500">Standard</div>
          </button>
          <button onClick={() => quickRoll(20)} className="bg-white border-2 border-red-200 rounded-xl p-4 text-center hover:border-red-400 hover:shadow-md transition-all group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🎯</span>
            <div className="font-semibold text-gray-800">D20</div>
            <div className="text-sm text-gray-500">D&D Die</div>
          </button>
          <button onClick={() => quickRoll(100)} className="bg-white border-2 border-red-200 rounded-xl p-4 text-center hover:border-red-400 hover:shadow-md transition-all group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">💯</span>
            <div className="font-semibold text-gray-800">D100</div>
            <div className="text-sm text-gray-500">Percentile</div>
          </button>
          <button onClick={rollCoins} className="bg-white border-2 border-red-200 rounded-xl p-4 text-center hover:border-red-400 hover:shadow-md transition-all group">
            <span className="text-3xl mb-2 block group-hover:scale-110 transition-transform">🪙</span>
            <div className="font-semibold text-gray-800">Coin</div>
            <div className="text-sm text-gray-500">Flip</div>
          </button>
        </div>
      </div>

      {/* Roll Result */}
      <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-8 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 text-center">Roll Result</h3>
        {!currentResult ? (
          <div className="text-center text-gray-500 py-8">
            <div className="text-7xl mb-4">🎲</div>
            <p className="text-xl">Click a quick roll button or customize below!</p>
          </div>
        ) : currentResult.coin ? (
          <div className="text-center">
            <div className="text-7xl mb-4">{currentResult.emoji}</div>
            <div className="text-5xl font-bold text-orange-600 mb-2">{currentResult.result}</div>
            <div className="text-lg text-gray-600">Coin Flip</div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-7xl mb-4">{getDiceEmoji(currentResult.finalResult, currentResult.sides)}</div>
            <div className="text-6xl font-bold text-red-600 mb-2">{currentResult.finalResult}</div>
            <div className="text-xl text-gray-600">
              {currentResult.rolls.length}d{currentResult.sides}
              {currentResult.modifier !== 0 ? ` ${currentResult.modifierType}${Math.abs(currentResult.modifier)}` : ''}
            </div>
            {currentResult.rolls.length > 1 && (
              <div className="text-sm text-gray-500 mt-2">Sum before modifier: {currentResult.sum}</div>
            )}
          </div>
        )}

        {/* Individual Dice Display */}
        {rolls.length > 1 && currentResult && !currentResult.coin && (
          <div className="mt-6 pt-6 border-t border-red-200">
            <h4 className="font-semibold text-gray-800 mb-3 text-center">Individual Dice</h4>
            <div className="grid grid-cols-5 md:grid-cols-10 gap-2 justify-center max-w-xl mx-auto">
              {rolls.map((roll, index) => (
                <div key={index} className="bg-white border-2 border-red-200 rounded-lg p-2 text-center">
                  <div className="text-lg mb-1">{getDiceEmoji(roll, currentResult.sides)}</div>
                  <div className="text-lg font-bold text-red-600">{roll}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Custom Dice Roll */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Custom Dice Roll</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Dice Count */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Number of Dice</label>
            <div className="flex items-center gap-2">
              <button onClick={() => adjustDiceCount(-1)} className="w-10 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-bold">-</button>
              <input
                type="number"
                value={diceCount}
                onChange={(e) => setDiceCount(Math.max(1, Math.min(20, parseInt(e.target.value) || 1)))}
                min="1"
                max="20"
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 text-center font-bold text-lg"
              />
              <button onClick={() => adjustDiceCount(1)} className="w-10 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors font-bold">+</button>
            </div>
          </div>

          {/* Dice Type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Dice Type</label>
            <select
              value={diceType}
              onChange={(e) => {
                setDiceType(e.target.value);
                setShowCustomSides(e.target.value === 'custom');
              }}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
            >
              <option value="4">D4 (4-sided)</option>
              <option value="6">D6 (6-sided)</option>
              <option value="8">D8 (8-sided)</option>
              <option value="10">D10 (10-sided)</option>
              <option value="12">D12 (12-sided)</option>
              <option value="20">D20 (20-sided)</option>
              <option value="100">D100 (100-sided)</option>
              <option value="custom">Custom Sides</option>
            </select>
          </div>

          {/* Custom Sides or Modifier */}
          {showCustomSides ? (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Custom Sides</label>
              <input
                type="number"
                value={customSides}
                onChange={(e) => setCustomSides(Math.max(2, Math.min(1000, parseInt(e.target.value) || 6)))}
                min="2"
                max="1000"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Modifier</label>
              <div className="flex items-center gap-2">
                <select
                  value={modifierType}
                  onChange={(e) => setModifierType(e.target.value)}
                  className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                >
                  <option value="+">+</option>
                  <option value="-">-</option>
                </select>
                <input
                  type="number"
                  value={modifierValue}
                  onChange={(e) => setModifierValue(Math.max(0, parseInt(e.target.value) || 0))}
                  min="0"
                  max="100"
                  className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>
          )}

          {/* Roll Button */}
          <div className="flex items-end">
            <button onClick={rollDice} className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-3 rounded-xl font-bold text-lg hover:from-red-700 hover:to-orange-700 transition-all transform hover:scale-[1.02]">
              🎲 Roll!
            </button>
          </div>
        </div>

        {/* D&D Presets */}
        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-gray-800 mb-3">D&D Presets</h4>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => rollPreset('4d6')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">4d6 (Stats)</button>
            <button onClick={() => rollPreset('3d6')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">3d6 (Basic)</button>
            <button onClick={() => rollPreset('2d10')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">2d10</button>
            <button onClick={() => rollPreset('1d20+5')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">1d20+5 (Skill)</button>
            <button onClick={() => rollPreset('2d6+3')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">2d6+3 (Damage)</button>
            <button onClick={() => rollPreset('1d12')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">1d12</button>
            <button onClick={() => rollPreset('8d6')} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors">8d6 (Fireball)</button>
          </div>
        </div>
      </div>

      {/* Roll History */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-800">Roll History</h3>
          <button onClick={clearHistory} className="text-sm text-red-600 hover:text-red-700 transition-colors font-medium">Clear</button>
        </div>
        <div className="max-h-48 overflow-y-auto space-y-2">
          {rollHistory.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No rolls yet</div>
          ) : (
            rollHistory.map((item, index) => (
              <div key={index} className={`bg-gray-50 rounded-lg p-3 border-l-4 ${item.type === 'coin' ? 'border-orange-500' : 'border-red-500'}`}>
                {item.type === 'coin' ? (
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Coin Flip: <span className="text-orange-600">{item.result}</span></span>
                    <span className="text-xs text-gray-500">{item.time}</span>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">
                        {item.rolls.length}d{item.sides}
                        {item.modifierValue > 0 ? ` ${item.modifierType}${item.modifierValue}` : ''}:
                        <span className="text-red-600 text-lg ml-2">{item.finalResult}</span>
                      </span>
                      <span className="text-xs text-gray-500">{item.time}</span>
                    </div>
                    {item.rolls.length > 1 && (
                      <div className="text-xs text-gray-500 mt-1">Individual: [{item.rolls.join(', ')}]</div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
{/* Related Tools */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
        <h3 className="font-semibold text-gray-800 mb-4">Related Tools</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedTools.map((tool) => (
            <Link
              key={tool.path}
              href={tool.path}
              className="flex flex-col items-center gap-2 p-4 rounded-xl hover:bg-gray-50 transition-colors group"
            >
              <div className={`w-12 h-12 ${tool.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform`}>
                {tool.icon}
              </div>
              <span className="font-medium text-gray-700 group-hover:text-red-600 transition-colors text-center text-sm">
                {tool.name}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Game Suggestions */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-6">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Games You Can Play</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-red-600 mb-2">🏰 Dungeons & Dragons</h4>
            <p className="text-gray-600 text-sm">Use D20 for ability checks, D6 for damage, and other dice for various game mechanics.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-blue-600 mb-2">🎯 Yahtzee</h4>
            <p className="text-gray-600 text-sm">Roll 5 D6 dice to create different combinations and score points.</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-semibold text-green-600 mb-2">🎲 Board Games</h4>
            <p className="text-gray-600 text-sm">Perfect for Monopoly, Risk, and any board game that requires dice rolls.</p>
          </div>
        </div>
      </div>

      

      {/* Mobile MREC2 - Before FAQs */}


      

      <GameAppMobileMrec2 />



      

      {/* FAQs Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="dice-roller" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
