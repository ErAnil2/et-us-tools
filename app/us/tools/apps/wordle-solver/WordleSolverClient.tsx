'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { SidebarMrec1, SidebarMrec2, MobileBelowSubheadingBanner, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How does the Wordle Solver work?',
    answer: 'Enter your guesses and mark each letter as green (correct position), yellow (wrong position), or gray (not in word). The solver filters possible words based on your feedback.',
    order: 1
  },
  {
    id: '2',
    question: 'What do the colors mean in Wordle?',
    answer: 'Green means the letter is correct and in the right position. Yellow means the letter is in the word but wrong position. Gray means the letter is not in the word.',
    order: 2
  },
  {
    id: '3',
    question: 'What\'s the best starting word for Wordle?',
    answer: 'Popular starting words include CRANE, SLATE, TRACE, and ADIEU. These contain common letters and help eliminate many possibilities quickly.',
    order: 3
  },
  {
    id: '4',
    question: 'How many guesses do I get in Wordle?',
    answer: 'In the standard Wordle game, you have 6 guesses to find the 5-letter word. This solver helps you make the most of each guess.',
    order: 4
  },
  {
    id: '5',
    question: 'Can this solver help with hard mode?',
    answer: 'Yes! In hard mode, you must use revealed hints in subsequent guesses. Our solver shows words that match all your current clues.',
    order: 5
  },
  {
    id: '6',
    question: 'Is this cheating at Wordle?',
    answer: 'This tool is meant to help you learn word patterns and improve your Wordle strategy. Many people use it to learn better techniques or when they\'re stuck.',
    order: 6
  }
];

// Common 5-letter Wordle words
const WORDLE_WORDS = [
  'about', 'above', 'abuse', 'actor', 'acute', 'admit', 'adopt', 'adult', 'after', 'again',
  'agent', 'agree', 'ahead', 'alarm', 'album', 'alert', 'alien', 'align', 'alike', 'alive',
  'allow', 'alone', 'along', 'alter', 'among', 'angel', 'anger', 'angle', 'angry', 'apart',
  'apple', 'apply', 'arena', 'argue', 'arise', 'armor', 'array', 'arrow', 'aside', 'asset',
  'audio', 'audit', 'avoid', 'award', 'aware', 'badly', 'baker', 'bases', 'basic', 'basis',
  'beach', 'began', 'begin', 'begun', 'being', 'belly', 'below', 'bench', 'bible', 'birth',
  'black', 'blade', 'blame', 'blank', 'blast', 'blend', 'bless', 'blind', 'block', 'blood',
  'blown', 'board', 'boost', 'booth', 'bound', 'brain', 'brand', 'brave', 'bread', 'break',
  'breed', 'brick', 'bride', 'brief', 'bring', 'broad', 'broke', 'brown', 'brush', 'build',
  'built', 'bunch', 'burst', 'buyer', 'cable', 'calif', 'canal', 'candy', 'carry', 'catch',
  'cause', 'chain', 'chair', 'chaos', 'charm', 'chart', 'chase', 'cheap', 'check', 'chest',
  'chief', 'child', 'china', 'chose', 'chunk', 'civil', 'claim', 'class', 'clean', 'clear',
  'clerk', 'click', 'climb', 'clock', 'close', 'cloth', 'cloud', 'coach', 'coast', 'colon',
  'color', 'couch', 'could', 'count', 'court', 'cover', 'crack', 'craft', 'crane', 'crash',
  'crazy', 'cream', 'crime', 'crisp', 'cross', 'crowd', 'crown', 'cruel', 'crush', 'curve',
  'cycle', 'daily', 'dance', 'dated', 'dealt', 'death', 'debut', 'delay', 'depth', 'devil',
  'diary', 'digit', 'dirty', 'doubt', 'dozen', 'draft', 'drain', 'drama', 'drank', 'drawn',
  'dream', 'dress', 'dried', 'drink', 'drive', 'drove', 'drunk', 'dying', 'eager', 'early',
  'earth', 'eaten', 'eight', 'elder', 'elect', 'elite', 'empty', 'enemy', 'enjoy', 'enter',
  'entry', 'equal', 'error', 'essay', 'event', 'every', 'exact', 'exist', 'extra', 'faced',
  'faith', 'false', 'fancy', 'fatal', 'fault', 'favor', 'feast', 'fiber', 'field', 'fifth',
  'fifty', 'fight', 'final', 'first', 'fixed', 'flame', 'flash', 'flesh', 'float', 'flood',
  'floor', 'flour', 'fluid', 'focus', 'force', 'forge', 'forth', 'forum', 'found', 'frame',
  'frank', 'fraud', 'fresh', 'front', 'frost', 'fruit', 'fully', 'funny', 'ghost', 'giant',
  'given', 'glass', 'globe', 'glory', 'going', 'gonna', 'grace', 'grade', 'grain', 'grand',
  'grant', 'grape', 'graph', 'grasp', 'grass', 'grave', 'great', 'green', 'grief', 'grill',
  'grind', 'gross', 'group', 'grove', 'grown', 'guard', 'guess', 'guest', 'guide', 'guilt',
  'habit', 'happy', 'harsh', 'haven', 'heart', 'heavy', 'hello', 'hence', 'hired', 'hobby',
  'honey', 'honor', 'hoped', 'horse', 'hotel', 'house', 'human', 'humor', 'hurry', 'ideal',
  'image', 'imply', 'index', 'inner', 'input', 'issue', 'items', 'joint', 'jones', 'judge',
  'juice', 'knife', 'knock', 'known', 'label', 'labor', 'lacks', 'large', 'laser', 'later',
  'laugh', 'layer', 'leads', 'learn', 'lease', 'least', 'leave', 'legal', 'lemon', 'level',
  'lever', 'light', 'limit', 'lived', 'liver', 'local', 'lodge', 'logic', 'loose', 'loses',
  'loved', 'lover', 'lower', 'loyal', 'lucky', 'lunch', 'lying', 'magic', 'major', 'maker',
  'march', 'marry', 'match', 'mayor', 'meant', 'medal', 'media', 'mercy', 'merge', 'merit',
  'metal', 'meter', 'midst', 'might', 'minor', 'minus', 'mixed', 'model', 'money', 'month',
  'moral', 'motor', 'mount', 'mouse', 'mouth', 'moved', 'movie', 'music', 'naked', 'named',
  'naval', 'needs', 'nerve', 'never', 'newly', 'night', 'noble', 'noise', 'north', 'noted',
  'novel', 'nurse', 'occur', 'ocean', 'offer', 'often', 'olive', 'onion', 'opens', 'opera',
  'orbit', 'order', 'organ', 'other', 'ought', 'outer', 'owned', 'owner', 'oxide', 'paint',
  'panel', 'panic', 'paper', 'party', 'pasta', 'patch', 'pause', 'peace', 'penny', 'phase',
  'phone', 'photo', 'piano', 'piece', 'pilot', 'pitch', 'pizza', 'place', 'plain', 'plane',
  'plant', 'plate', 'plaza', 'point', 'polar', 'pound', 'power', 'press', 'price', 'pride',
  'prime', 'print', 'prior', 'prize', 'probe', 'proof', 'proud', 'prove', 'proxy', 'queen',
  'quest', 'quick', 'quiet', 'quite', 'quota', 'quote', 'radar', 'radio', 'raise', 'rally',
  'ranch', 'range', 'rapid', 'ratio', 'reach', 'react', 'ready', 'realm', 'rebel', 'refer',
  'reign', 'relax', 'reply', 'rider', 'ridge', 'rifle', 'right', 'rigid', 'river', 'robot',
  'rocky', 'roman', 'rough', 'round', 'route', 'royal', 'ruler', 'rural', 'sadly', 'saint',
  'salad', 'sales', 'sauce', 'saved', 'scale', 'scene', 'scope', 'score', 'scout', 'sense',
  'serve', 'setup', 'seven', 'shade', 'shake', 'shall', 'shame', 'shape', 'share', 'shark',
  'sharp', 'sheep', 'sheer', 'sheet', 'shelf', 'shell', 'shift', 'shine', 'shirt', 'shock',
  'shoot', 'shore', 'short', 'shown', 'sight', 'sigma', 'since', 'sixth', 'sixty', 'sized',
  'skill', 'slate', 'slave', 'sleep', 'slice', 'slide', 'slope', 'small', 'smart', 'smell',
  'smile', 'smoke', 'snake', 'solid', 'solve', 'sorry', 'sound', 'south', 'space', 'spare',
  'spark', 'speak', 'speed', 'spend', 'spent', 'spill', 'spine', 'spite', 'split', 'spoke',
  'sport', 'spray', 'staff', 'stage', 'stake', 'stamp', 'stand', 'start', 'state', 'steak',
  'steal', 'steam', 'steel', 'steep', 'steer', 'stick', 'still', 'stock', 'stone', 'stood',
  'store', 'storm', 'story', 'stove', 'strap', 'strip', 'stuck', 'study', 'stuff', 'style',
  'sugar', 'suite', 'super', 'surge', 'swear', 'sweep', 'sweet', 'swift', 'swing', 'sword',
  'table', 'taken', 'tales', 'taste', 'taxes', 'teach', 'teeth', 'tempo', 'tends', 'tenor',
  'tense', 'tenth', 'terms', 'texas', 'thank', 'theft', 'theme', 'there', 'these', 'thick',
  'thing', 'think', 'third', 'those', 'three', 'threw', 'throw', 'thumb', 'tiger', 'tight',
  'timer', 'tired', 'title', 'toast', 'today', 'token', 'topic', 'total', 'touch', 'tough',
  'tower', 'trace', 'track', 'trade', 'trail', 'train', 'trash', 'treat', 'trend', 'trial',
  'tribe', 'trick', 'tried', 'tries', 'troop', 'truck', 'truly', 'trunk', 'trust', 'truth',
  'tumor', 'tuned', 'turns', 'twice', 'twins', 'twist', 'ultra', 'uncle', 'under', 'union',
  'unite', 'unity', 'until', 'upper', 'upset', 'urban', 'usage', 'usual', 'vague', 'valid',
  'value', 'valve', 'venue', 'verse', 'video', 'views', 'villa', 'virus', 'visit', 'vital',
  'vocal', 'voice', 'voter', 'wages', 'waste', 'watch', 'water', 'waves', 'weigh', 'weird',
  'whale', 'wheat', 'wheel', 'where', 'which', 'while', 'white', 'whole', 'whose', 'wider',
  'widow', 'widen', 'width', 'woman', 'women', 'woods', 'words', 'world', 'worry', 'worse',
  'worst', 'worth', 'would', 'wound', 'write', 'wrong', 'wrote', 'yards', 'years', 'yield',
  'young', 'yours', 'youth', 'zones'
];

type LetterState = 'empty' | 'gray' | 'yellow' | 'green';

interface LetterCell {
  letter: string;
  state: LetterState;
}

export default function WordleSolverClient() {
  const [guesses, setGuesses] = useState<LetterCell[][]>([
    Array(5).fill({ letter: '', state: 'empty' as LetterState })
  ]);
  const [currentRow, setCurrentRow] = useState(0);

  const { getH1, getSubHeading, faqSchema } = usePageSEO('wordle-solver');

  const webAppSchema = generateWebAppSchema(
    'Wordle Solver - Find the Answer Helper',
    'Free Wordle solver and helper. Enter your guesses and get word suggestions based on letter positions. Never lose at Wordle again!',
    'https://economictimes.indiatimes.com/us/tools/apps/wordle-solver',
    'GameApplication'
  );

  const updateLetter = (rowIndex: number, colIndex: number, letter: string) => {
    const newGuesses = [...guesses];
    newGuesses[rowIndex] = [...newGuesses[rowIndex]];
    newGuesses[rowIndex][colIndex] = {
      ...newGuesses[rowIndex][colIndex],
      letter: letter.toUpperCase().slice(0, 1)
    };
    setGuesses(newGuesses);
  };

  const cycleState = (rowIndex: number, colIndex: number) => {
    const currentState = guesses[rowIndex][colIndex].state;
    const states: LetterState[] = ['empty', 'gray', 'yellow', 'green'];
    const nextIndex = (states.indexOf(currentState) + 1) % states.length;

    const newGuesses = [...guesses];
    newGuesses[rowIndex] = [...newGuesses[rowIndex]];
    newGuesses[rowIndex][colIndex] = {
      ...newGuesses[rowIndex][colIndex],
      state: states[nextIndex]
    };
    setGuesses(newGuesses);
  };

  const addRow = () => {
    if (guesses.length < 6) {
      setGuesses([...guesses, Array(5).fill({ letter: '', state: 'empty' as LetterState })]);
      setCurrentRow(guesses.length);
    }
  };

  const clearAll = () => {
    setGuesses([Array(5).fill({ letter: '', state: 'empty' as LetterState })]);
    setCurrentRow(0);
  };

  const possibleWords = useMemo(() => {
    let words = [...WORDLE_WORDS];

    // Build constraints from guesses
    const greenLetters: { [pos: number]: string } = {};
    const yellowLetters: { letter: string; notAtPos: number[] }[] = [];
    const grayLetters: Set<string> = new Set();
    const mustContain: Set<string> = new Set();

    guesses.forEach(row => {
      row.forEach((cell, pos) => {
        if (!cell.letter) return;
        const letter = cell.letter.toLowerCase();

        if (cell.state === 'green') {
          greenLetters[pos] = letter;
          mustContain.add(letter);
        } else if (cell.state === 'yellow') {
          const existing = yellowLetters.find(y => y.letter === letter);
          if (existing) {
            existing.notAtPos.push(pos);
          } else {
            yellowLetters.push({ letter, notAtPos: [pos] });
          }
          mustContain.add(letter);
        } else if (cell.state === 'gray') {
          grayLetters.add(letter);
        }
      });
    });

    // Remove gray letters that are also green or yellow (duplicate letter scenario)
    mustContain.forEach(letter => grayLetters.delete(letter));

    // Filter words
    words = words.filter(word => {
      // Check green letters
      for (const [pos, letter] of Object.entries(greenLetters)) {
        if (word[parseInt(pos)] !== letter) return false;
      }

      // Check yellow letters
      for (const yellow of yellowLetters) {
        if (!word.includes(yellow.letter)) return false;
        for (const pos of yellow.notAtPos) {
          if (word[pos] === yellow.letter) return false;
        }
      }

      // Check gray letters
      for (const letter of grayLetters) {
        if (word.includes(letter)) return false;
      }

      return true;
    });

    return words.slice(0, 50);
  }, [guesses]);

  const getStateColor = (state: LetterState) => {
    switch (state) {
      case 'green': return 'bg-green-500 border-green-600 text-white';
      case 'yellow': return 'bg-yellow-500 border-yellow-600 text-white';
      case 'gray': return 'bg-gray-500 border-gray-600 text-white';
      default: return 'bg-white border-gray-300';
    }
  };

  const relatedTools = [
    { name: 'Quordle Solver', path: '/us/tools/apps/quordle-solver', color: 'bg-purple-500' },
    { name: 'Anagram Solver', path: '/us/tools/apps/anagram-solver', color: 'bg-emerald-500' },
    { name: 'Scrabble Helper', path: '/us/tools/apps/scrabble-helper', color: 'bg-blue-500' },
    { name: 'Jumble Solver', path: '/us/tools/apps/jumble-solver', color: 'bg-orange-500' },
  ];

  const guessCount = guesses.filter(row => row.some(cell => cell.letter)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="inline-flex items-center gap-3 bg-gradient-to-r from-green-100 to-emerald-100 px-6 py-3 rounded-full mb-4">
          <span className="text-2xl">🟩</span>
          <span className="text-green-600 font-semibold">Wordle Solver</span>
        </div>

        <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-4">
          {getH1('Wordle Solver')}
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          {getSubHeading('Enter your Wordle guesses and click letters to change their color. Get suggestions for your next guess!')}
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Mobile Stats Bar */}
      <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{guessCount}</div>
          <div className="text-xs opacity-80">Guesses</div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{possibleWords.length}</div>
          <div className="text-xs opacity-80">Matches</div>
        </div>
        <div className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">{6 - guessCount}</div>
          <div className="text-xs opacity-80">Left</div>
        </div>
        <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg p-2 text-center text-white">
          <div className="text-lg font-bold">5</div>
          <div className="text-xs opacity-80">Letters</div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 min-w-0">
          {/* Wordle Grid */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-800">Enter Your Guesses</h2>
              <div className="flex gap-2">
                <button
                  onClick={addRow}
                  disabled={guesses.length >= 6}
                  className="px-4 py-2 bg-green-100 text-green-700 rounded-lg font-medium hover:bg-green-200 transition-colors disabled:opacity-50"
                >
                  + Add Row
                </button>
                <button
                  onClick={clearAll}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>

            <div className="space-y-2 mb-4">
              {guesses.map((row, rowIndex) => (
                <div key={rowIndex} className="flex gap-2 justify-center">
                  {row.map((cell, colIndex) => (
                    <div key={colIndex} className="relative">
                      <input
                        type="text"
                        value={cell.letter}
                        onChange={(e) => updateLetter(rowIndex, colIndex, e.target.value)}
                        onClick={() => cell.letter && cycleState(rowIndex, colIndex)}
                        maxLength={1}
                        className={`w-14 h-14 text-2xl font-bold text-center border-2 rounded-lg uppercase focus:ring-2 focus:ring-green-500 ${getStateColor(cell.state)}`}
                        placeholder=""
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-2">How to use:</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>1. Type a letter in each box</li>
                <li>2. Click on a letter to cycle through colors: White → Gray → Yellow → Green</li>
                <li>3. <span className="inline-block w-4 h-4 bg-green-500 rounded align-middle"></span> Green = correct position</li>
                <li>4. <span className="inline-block w-4 h-4 bg-yellow-500 rounded align-middle"></span> Yellow = wrong position</li>
                <li>5. <span className="inline-block w-4 h-4 bg-gray-500 rounded align-middle"></span> Gray = not in word</li>
              </ul>
            </div>
          </div>

          {/* Suggestions */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Suggested Words ({possibleWords.length} matches)
            </h2>

            {possibleWords.length > 0 ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 max-h-64 overflow-y-auto">
                {possibleWords.map((word, index) => (
                  <div
                    key={index}
                    className="p-2 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg text-center font-mono font-semibold text-green-800 uppercase"
                  >
                    {word}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <span className="text-3xl mb-2 block">🤔</span>
                <p>No matching words found. Check your letter colors.</p>
              </div>
            )}
          </div>

          {/* Best Starting Words */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Best Starting Words</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['CRANE', 'SLATE', 'TRACE', 'ADIEU'].map(word => (
                <div key={word} className="bg-white rounded-xl p-4 text-center">
                  <div className="font-mono font-bold text-2xl text-green-600 mb-1">{word}</div>
                  <div className="text-xs text-gray-500">Popular starter</div>
                </div>
              ))}
            </div>
          </div>

          

          {/* Mobile MREC2 - Before FAQs */}


          

          <GameAppMobileMrec2 />



          

          {/* FAQs Section */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="wordle-solver" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Desktop Stats */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Game Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-green-100 rounded-xl">
                <span className="text-gray-600">Guesses Made</span>
                <span className="font-bold text-green-600">{guessCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-xl">
                <span className="text-gray-600">Possible Words</span>
                <span className="font-bold text-emerald-600">{possibleWords.length}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-teal-100 rounded-xl">
                <span className="text-gray-600">Guesses Left</span>
                <span className="font-bold text-teal-600">{6 - guessCount}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-cyan-50 to-cyan-100 rounded-xl">
                <span className="text-gray-600">Word Length</span>
                <span className="font-bold text-cyan-600">5 letters</span>
              </div>
            </div>
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Ad Banner */}
          <div className="hidden lg:block">
            <AdBanner className="w-full" />
          </div>
{/* Related Tools */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-lg p-4">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Related Tools</h3>
            <div className="space-y-2">
              {relatedTools.map((tool) => (
                <Link
                  key={tool.path}
                  href={tool.path}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <div className={`w-3 h-3 rounded-full ${tool.color}`}></div>
                  <span className="text-gray-700 hover:text-green-600">{tool.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Tips */}
          <div className="hidden lg:block bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-4 text-white">
            <h3 className="text-lg font-bold mb-3">Quick Tips</h3>
            <ul className="space-y-2 text-sm opacity-90">
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Start with words that have common vowels</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Use yellow letters in different positions</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>Avoid reusing gray letters</span>
              </li>
              <li className="flex items-start gap-2">
                <span>•</span>
                <span>CRANE and SLATE are great starters</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
