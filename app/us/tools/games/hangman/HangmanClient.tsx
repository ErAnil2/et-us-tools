'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon?: string;
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I play Hangman?',
    answer: 'Click on letters to guess the hidden word. Correct letters are revealed. You have 6 wrong guesses before game over.',
    order: 1
  },
  {
    id: '2',
    question: 'What categories are available?',
    answer: 'Animals, Food, Countries, Sports, Movies, and Science. Each has words for all difficulty levels.',
    order: 2
  },
  {
    id: '3',
    question: 'How does the hint system work?',
    answer: 'Click "Show Hint" to get a clue about the word. Using a hint deducts 10 points from your score.',
    order: 3
  },
  {
    id: '4',
    question: 'How is the score calculated?',
    answer: 'Base score = word length × 10, multiplied by difficulty (Easy ×1, Medium ×1.5, Hard ×2), minus penalties.',
    order: 4
  },
  {
    id: '5',
    question: 'What are the difficulty levels?',
    answer: 'Easy (3-5 letters), Medium (6-8 letters), Hard (9+ letters). Higher difficulty = higher score multiplier.',
    order: 5
  },
  {
    id: '6',
    question: 'Is Hangman free to play?',
    answer: 'Yes! Hangman is completely free. No downloads or sign-ups required.',
    order: 6
  }
];

interface HangmanClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

interface Stats {
  gamesPlayed: number;
  gamesWon: number;
  bestStreak: number;
  currentStreak: number;
  totalScore: number;
}

// Word lists with hints
const wordData = {
  animals: {
    easy: [
      { word: 'CAT', hint: 'Small furry pet that meows' },
      { word: 'DOG', hint: 'Man\'s best friend' },
      { word: 'BIRD', hint: 'Flying creature with feathers' },
      { word: 'FISH', hint: 'Lives underwater' },
      { word: 'BEAR', hint: 'Large furry forest animal' },
      { word: 'LION', hint: 'King of the jungle' },
      { word: 'FROG', hint: 'Green animal that hops' },
      { word: 'COW', hint: 'Farm animal that gives milk' }
    ],
    medium: [
      { word: 'ELEPHANT', hint: 'Largest land animal with trunk' },
      { word: 'GIRAFFE', hint: 'Tallest animal in the world' },
      { word: 'PENGUIN', hint: 'Black and white bird from Antarctica' },
      { word: 'DOLPHIN', hint: 'Intelligent marine mammal' },
      { word: 'KANGAROO', hint: 'Australian animal that hops' },
      { word: 'GORILLA', hint: 'Large ape from Africa' },
      { word: 'CHEETAH', hint: 'Fastest land animal' }
    ],
    hard: [
      { word: 'RHINOCEROS', hint: 'Large animal with horn on nose' },
      { word: 'HIPPOPOTAMUS', hint: 'Large African river animal' },
      { word: 'CHIMPANZEE', hint: 'Intelligent ape related to humans' },
      { word: 'CROCODILE', hint: 'Large reptile in rivers' },
      { word: 'BUTTERFLY', hint: 'Colorful flying insect' }
    ]
  },
  food: {
    easy: [
      { word: 'PIZZA', hint: 'Italian dish with cheese and toppings' },
      { word: 'BREAD', hint: 'Baked from flour' },
      { word: 'APPLE', hint: 'Red or green fruit' },
      { word: 'CAKE', hint: 'Sweet dessert for celebrations' },
      { word: 'RICE', hint: 'White grain from Asia' },
      { word: 'SOUP', hint: 'Liquid food in a bowl' },
      { word: 'MILK', hint: 'White drink from cows' }
    ],
    medium: [
      { word: 'BANANA', hint: 'Yellow curved fruit' },
      { word: 'CHICKEN', hint: 'Popular poultry meat' },
      { word: 'COOKIES', hint: 'Sweet baked snack' },
      { word: 'PANCAKE', hint: 'Flat breakfast food' },
      { word: 'AVOCADO', hint: 'Green fruit for guacamole' },
      { word: 'MUSHROOM', hint: 'Fungi used in cooking' }
    ],
    hard: [
      { word: 'SPAGHETTI', hint: 'Long Italian pasta' },
      { word: 'CHOCOLATE', hint: 'Sweet made from cocoa' },
      { word: 'STRAWBERRY', hint: 'Red berry with seeds outside' },
      { word: 'PINEAPPLE', hint: 'Tropical fruit with spiky outside' }
    ]
  },
  countries: {
    easy: [
      { word: 'SPAIN', hint: 'European country famous for flamenco' },
      { word: 'ITALY', hint: 'Boot-shaped European country' },
      { word: 'JAPAN', hint: 'Island nation in Asia' },
      { word: 'INDIA', hint: 'Large South Asian country' },
      { word: 'CHINA', hint: 'Most populous country' },
      { word: 'FRANCE', hint: 'Home of the Eiffel Tower' }
    ],
    medium: [
      { word: 'GERMANY', hint: 'European country famous for beer' },
      { word: 'CANADA', hint: 'North American country with maple leaf' },
      { word: 'BRAZIL', hint: 'Largest South American country' },
      { word: 'MEXICO', hint: 'Country south of USA' },
      { word: 'RUSSIA', hint: 'Largest country by area' }
    ],
    hard: [
      { word: 'AUSTRALIA', hint: 'Island continent in the south' },
      { word: 'ARGENTINA', hint: 'South American country with tango' },
      { word: 'SWITZERLAND', hint: 'European country famous for chocolate' },
      { word: 'NETHERLANDS', hint: 'European country with tulips' }
    ]
  },
  sports: {
    easy: [
      { word: 'GOLF', hint: 'Sport with clubs and holes' },
      { word: 'SWIM', hint: 'Move through water' },
      { word: 'KICK', hint: 'Strike with foot' },
      { word: 'BALL', hint: 'Round object used in many sports' },
      { word: 'GOAL', hint: 'Score target in many sports' }
    ],
    medium: [
      { word: 'FOOTBALL', hint: 'American sport with touchdown' },
      { word: 'BASEBALL', hint: 'Sport with bat and diamond' },
      { word: 'SWIMMING', hint: 'Olympic water sport' },
      { word: 'CYCLING', hint: 'Sport on bicycle' },
      { word: 'ARCHERY', hint: 'Sport with bow and arrow' }
    ],
    hard: [
      { word: 'BASKETBALL', hint: 'Sport with hoops and dunks' },
      { word: 'VOLLEYBALL', hint: 'Team sport with net' },
      { word: 'BADMINTON', hint: 'Racket sport with shuttlecock' },
      { word: 'GYMNASTICS', hint: 'Sport with flips and balance' }
    ]
  },
  movies: {
    easy: [
      { word: 'AVATAR', hint: 'Blue aliens on Pandora' },
      { word: 'FROZEN', hint: 'Disney movie with Elsa' },
      { word: 'CARS', hint: 'Pixar movie with Lightning McQueen' },
      { word: 'JAWS', hint: 'Classic shark movie' },
      { word: 'SHREK', hint: 'Green ogre in swamp' }
    ],
    medium: [
      { word: 'TITANIC', hint: 'Ship that sank in 1912' },
      { word: 'BATMAN', hint: 'Dark Knight superhero' },
      { word: 'MATRIX', hint: 'Movie about simulated reality' },
      { word: 'GLADIATOR', hint: 'Roman warrior fighter' }
    ],
    hard: [
      { word: 'INCEPTION', hint: 'Dreams within dreams' },
      { word: 'AVENGERS', hint: 'Marvel superhero team' },
      { word: 'INTERSTELLAR', hint: 'Space travel through wormhole' }
    ]
  },
  science: {
    easy: [
      { word: 'ATOM', hint: 'Smallest unit of matter' },
      { word: 'STAR', hint: 'Giant ball of burning gas' },
      { word: 'MOON', hint: 'Earth\'s natural satellite' },
      { word: 'WAVE', hint: 'Energy traveling through medium' },
      { word: 'CELL', hint: 'Basic unit of life' }
    ],
    medium: [
      { word: 'GRAVITY', hint: 'Force that pulls things down' },
      { word: 'MOLECULE', hint: 'Group of atoms bonded' },
      { word: 'VOLCANO', hint: 'Mountain that erupts lava' },
      { word: 'CRYSTAL', hint: 'Solid with ordered atoms' }
    ],
    hard: [
      { word: 'CHROMOSOME', hint: 'Carries genetic information' },
      { word: 'ECOSYSTEM', hint: 'Community of living things' },
      { word: 'ATMOSPHERE', hint: 'Layer of gases around Earth' }
    ]
  }
};

type Category = keyof typeof wordData;
type Difficulty = 'easy' | 'medium' | 'hard';

export default function HangmanClient({ relatedGames = defaultRelatedGames }: HangmanClientProps) {
  const [category, setCategory] = useState<Category>('animals');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');

  const [currentWord, setCurrentWord] = useState('');
  const [currentHint, setCurrentHint] = useState('');
  const [guessedLetters, setGuessedLetters] = useState<string[]>([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const [score, setScore] = useState(0);
  const [roundScore, setRoundScore] = useState(0);
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    gamesWon: 0,
    bestStreak: 0,
    currentStreak: 0,
    totalScore: 0
  });

  const [gameResult, setGameResult] = useState<'won' | 'lost' | null>(null);

  const maxWrongGuesses = 6;

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('hangman');

  const webAppSchema = generateWebAppSchema(
    'Hangman - Free Online Word Guessing Game',
    'Play Hangman online for free. Guess letters to reveal hidden words. 6 categories, 3 difficulty levels, hints, and achievements!',
    'https://economictimes.indiatimes.com/us/tools/games/hangman',
    'Game'
  );

  const categories = [
    { id: 'animals' as Category, name: 'Animals', icon: '🦁' },
    { id: 'food' as Category, name: 'Food', icon: '🍕' },
    { id: 'countries' as Category, name: 'Countries', icon: '🌍' },
    { id: 'sports' as Category, name: 'Sports', icon: '⚽' },
    { id: 'movies' as Category, name: 'Movies', icon: '🎬' },
    { id: 'science' as Category, name: 'Science', icon: '🔬' }
  ];

  const difficulties = [
    { id: 'easy' as Difficulty, name: 'Easy', desc: '3-5 letters', multiplier: 1 },
    { id: 'medium' as Difficulty, name: 'Medium', desc: '6-8 letters', multiplier: 1.5 },
    { id: 'hard' as Difficulty, name: 'Hard', desc: '9+ letters', multiplier: 2 }
  ];

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('hangmanStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
  }, []);

  const startGame = () => {
    const words = wordData[category][difficulty];
    const randomIndex = Math.floor(Math.random() * words.length);
    const selected = words[randomIndex];

    setCurrentWord(selected.word);
    setCurrentHint(selected.hint);
    setGuessedLetters([]);
    setWrongGuesses(0);
    setShowHint(false);
    setRoundScore(0);
    setGameResult(null);
    setIsPlaying(true);
  };

  const guessLetter = (letter: string) => {
    if (guessedLetters.includes(letter) || !isPlaying || gameResult) return;

    const newGuessed = [...guessedLetters, letter];
    setGuessedLetters(newGuessed);

    if (currentWord.includes(letter)) {
      const isComplete = currentWord.split('').every(l => newGuessed.includes(l));
      if (isComplete) {
        handleWin();
      }
    } else {
      const newWrong = wrongGuesses + 1;
      setWrongGuesses(newWrong);
      if (newWrong >= maxWrongGuesses) {
        handleLose();
      }
    }
  };

  const handleWin = useCallback(() => {
    const diffMultiplier = difficulties.find(d => d.id === difficulty)?.multiplier || 1;
    const basePoints = currentWord.length * 10;
    const wrongPenalty = wrongGuesses * 3;
    const hintPenalty = showHint ? 10 : 0;
    const points = Math.max(10, Math.round((basePoints - wrongPenalty - hintPenalty) * diffMultiplier));

    setRoundScore(points);
    setScore(s => s + points);
    setGameResult('won');

    const newStats: Stats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      gamesWon: stats.gamesWon + 1,
      currentStreak: stats.currentStreak + 1,
      bestStreak: Math.max(stats.bestStreak, stats.currentStreak + 1),
      totalScore: stats.totalScore + points
    };

    setStats(newStats);
    localStorage.setItem('hangmanStats', JSON.stringify(newStats));
  }, [currentWord, wrongGuesses, showHint, difficulty, stats]);

  const handleLose = useCallback(() => {
    setGameResult('lost');

    const newStats: Stats = {
      ...stats,
      gamesPlayed: stats.gamesPlayed + 1,
      currentStreak: 0
    };

    setStats(newStats);
    localStorage.setItem('hangmanStats', JSON.stringify(newStats));
  }, [stats]);

  const newGame = () => {
    setIsPlaying(false);
    setGameResult(null);
  };

  const getDisplayWord = () => {
    return currentWord.split('').map((letter, i) => (
      <span
        key={i}
        className={`inline-block w-8 sm:w-12 h-10 sm:h-14 mx-0.5 sm:mx-1 border-b-4 ${
          guessedLetters.includes(letter)
            ? 'border-sky-500 text-sky-700'
            : 'border-gray-300'
        } text-xl sm:text-3xl font-bold text-center`}
      >
        {guessedLetters.includes(letter) ? letter : ''}
      </span>
    ));
  };

  const currentCat = categories.find(c => c.id === category);

  // Hangman SVG parts
  const hangmanParts = [
    wrongGuesses >= 1 && <circle key="head" cx="100" cy="45" r="20" stroke="#0ea5e9" strokeWidth="3" fill="none" />,
    wrongGuesses >= 2 && <line key="body" x1="100" y1="65" x2="100" y2="120" stroke="#0ea5e9" strokeWidth="3" />,
    wrongGuesses >= 3 && <line key="leftArm" x1="100" y1="80" x2="70" y2="100" stroke="#0ea5e9" strokeWidth="3" />,
    wrongGuesses >= 4 && <line key="rightArm" x1="100" y1="80" x2="130" y2="100" stroke="#0ea5e9" strokeWidth="3" />,
    wrongGuesses >= 5 && <line key="leftLeg" x1="100" y1="120" x2="70" y2="160" stroke="#0ea5e9" strokeWidth="3" />,
    wrongGuesses >= 6 && <line key="rightLeg" x1="100" y1="120" x2="130" y2="160" stroke="#0ea5e9" strokeWidth="3" />
  ];

  return (
    <>
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

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-sky-500 to-blue-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🎪</span>
            <span className="text-white font-semibold text-sm">Classic Game</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 bg-clip-text text-transparent mb-2">
            {getH1('Hangman Game')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Guess the hidden word one letter at a time. 6 wrong guesses and it\'s game over!')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout: Game + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1 min-w-0">
            {/* Game Container */}
            <div className="bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-sky-100">
              {/* Score Bar - Mobile/Tablet */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 lg:hidden">
                <div className="bg-gradient-to-br from-sky-500 to-blue-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">SCORE</div>
                  <div className="text-lg sm:text-xl font-bold">{score}</div>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">STREAK</div>
                  <div className="text-lg sm:text-xl font-bold">{stats.currentStreak}🔥</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">WON</div>
                  <div className="text-lg sm:text-xl font-bold">{stats.gamesWon}</div>
                </div>
                <div className="bg-gradient-to-br from-red-500 to-rose-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">WRONG</div>
                  <div className="text-lg sm:text-xl font-bold">{wrongGuesses}/6</div>
                </div>
              </div>

              {!isPlaying ? (
                /* Game Setup */
                <div className="space-y-4">
                  {/* Category Selection */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Category</div>
                    <div className="grid grid-cols-6 gap-2">
                      {categories.map(cat => (
                        <button
                          key={cat.id}
                          onClick={() => setCategory(cat.id)}
                          className={`p-2 sm:p-3 rounded-xl transition-all text-center ${
                            category === cat.id
                              ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="text-lg">{cat.icon}</div>
                          <div className="text-[10px] font-medium">{cat.name}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Difficulty Selection */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Difficulty</div>
                    <div className="grid grid-cols-3 gap-2">
                      {difficulties.map(d => (
                        <button
                          key={d.id}
                          onClick={() => setDifficulty(d.id)}
                          className={`p-3 rounded-xl transition-all text-center ${
                            difficulty === d.id
                              ? 'bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="font-semibold text-sm">{d.name}</div>
                          <div className="text-[10px] opacity-70">{d.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startGame}
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
                  >
                    🎮 Start Game
                  </button>
                </div>
              ) : (
                /* Active Game */
                <div>
                  {/* Game Info */}
                  <div className="flex items-center justify-between mb-4 bg-white/60 rounded-xl p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{currentCat?.icon}</span>
                      <span className="font-semibold text-gray-800">{currentCat?.name}</span>
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-600 text-sm capitalize">{difficulty}</span>
                    </div>
                    <div className={`font-bold ${wrongGuesses >= 5 ? 'text-red-500' : 'text-gray-700'}`}>
                      ❤️ {maxWrongGuesses - wrongGuesses} left
                    </div>
                    <button
                      onClick={newGame}
                      className="text-gray-500 hover:text-gray-700 px-2"
                    >
                      ✕ End
                    </button>
                  </div>

                  {/* Hangman Drawing */}
                  <div className="flex justify-center mb-4">
                    <svg width="160" height="180" viewBox="0 0 160 180" className="mx-auto">
                      <line x1="20" y1="170" x2="140" y2="170" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                      <line x1="40" y1="170" x2="40" y2="20" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                      <line x1="40" y1="20" x2="100" y2="20" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                      <line x1="100" y1="20" x2="100" y2="25" stroke="#94a3b8" strokeWidth="3" />
                      {hangmanParts}
                    </svg>
                  </div>

                  {/* Word Display */}
                  <div className="mb-4 text-center">
                    <div className="mb-4">{getDisplayWord()}</div>
                    {showHint && (
                      <div className="text-sky-600 text-sm bg-sky-50 px-4 py-2 rounded-lg inline-block">
                        💡 {currentHint}
                      </div>
                    )}
                  </div>

                  {/* Game Result Overlay */}
                  {gameResult && (
                    <div className={`mb-4 p-4 rounded-xl text-center ${
                      gameResult === 'won' ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <div className="text-3xl mb-2">{gameResult === 'won' ? '🎉' : '😔'}</div>
                      <div className={`text-xl font-bold ${gameResult === 'won' ? 'text-green-700' : 'text-red-700'}`}>
                        {gameResult === 'won' ? `You Won! +${roundScore} points` : 'Game Over!'}
                      </div>
                      <div className="text-gray-600 text-sm mt-1">
                        The word was: <span className="font-bold">{currentWord}</span>
                      </div>
                      <div className="flex gap-2 justify-center mt-3">
                        <button
                          onClick={startGame}
                          className="px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 text-white rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700"
                        >
                          Play Again
                        </button>
                        <button
                          onClick={newGame}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                        >
                          Change Settings
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Keyboard */}
                  {!gameResult && (
                    <>
                      <div className="max-w-lg mx-auto mb-4">
                        <div className="grid grid-cols-9 gap-1 sm:gap-2">
                          {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map(letter => {
                            const isGuessed = guessedLetters.includes(letter);
                            const isCorrect = isGuessed && currentWord.includes(letter);
                            const isWrong = isGuessed && !currentWord.includes(letter);

                            return (
                              <button
                                key={letter}
                                onClick={() => guessLetter(letter)}
                                disabled={isGuessed}
                                className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg font-bold text-sm sm:text-base transition-all ${
                                  isCorrect
                                    ? 'bg-green-500 text-white'
                                    : isWrong
                                    ? 'bg-red-400 text-white'
                                    : isGuessed
                                    ? 'bg-gray-200 text-gray-400'
                                    : 'bg-sky-100 text-sky-700 hover:bg-sky-200 hover:scale-105 active:scale-95'
                                }`}
                              >
                                {letter}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Hint Button */}
                      <div className="text-center">
                        <button
                          onClick={() => setShowHint(true)}
                          disabled={showHint}
                          className="px-6 py-2 bg-amber-100 text-amber-700 rounded-lg font-medium hover:bg-amber-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          💡 Show Hint {showHint ? '(Used)' : '(-10 pts)'}
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> How to Play
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Choose Settings</div>
                    <div className="text-gray-600">Pick a category and difficulty level</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Guess Letters</div>
                    <div className="text-gray-600">Click letters to guess the word</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Use Hints</div>
                    <div className="text-gray-600">Get a clue if you're stuck (costs points)</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-sky-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-sky-600 font-bold">4</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Win Before 6 Wrongs</div>
                    <div className="text-gray-600">Complete the word to earn points!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-br from-sky-50 to-blue-50 rounded-2xl p-5 border border-sky-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Pro Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-sky-700 mb-1">Start with Vowels</div>
                  <div className="text-gray-600">A, E, I, O, U appear in most words</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-sky-700 mb-1">Common Consonants</div>
                  <div className="text-gray-600">Try R, S, T, L, N - they're very common</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-sky-700 mb-1">Use Category Hint</div>
                  <div className="text-gray-600">Think about words that fit the theme</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-sky-700 mb-1">Count Letters</div>
                  <div className="text-gray-600">Word length helps narrow down options</div>
                </div>
              </div>
            </div>
          </div>
{/* Right Sidebar - 320px */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Score Card - Desktop Only */}
            <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Game Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-sky-50 to-blue-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Score</span>
                  <span className="text-2xl font-bold text-sky-600">{score}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Streak</span>
                  <span className="text-2xl font-bold text-green-600">{stats.currentStreak} 🔥</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Won</div>
                    <div className="text-xl font-bold text-gray-700">{stats.gamesWon}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Played</div>
                    <div className="text-xl font-bold text-gray-700">{stats.gamesPlayed}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Banner */}
            {/* Ad banner replaced with MREC components */}

            {/* Your Stats */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Your Stats</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Games Won</span>
                  <span className="text-gray-800 font-bold">{stats.gamesWon} / {stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Current Streak</span>
                  <span className="text-sky-600 font-bold">{stats.currentStreak} 🔥</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="text-blue-600 font-bold">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Total Score</span>
                  <span className="text-gray-800 font-bold">{stats.totalScore}</span>
                </div>
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">More Word Games</h3>
              <div className="space-y-2">
                {relatedGames.slice(0, 4).map(game => (
                  <Link key={game.href} href={game.href} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                    <div className={`w-10 h-10 rounded-lg ${game.color} flex items-center justify-center text-lg text-white group-hover:scale-110 transition-transform`}>
                      {game.icon === 'word' ? '🔤' : game.icon === 'speed' ? '⌨️' : game.icon === 'puzzle' ? '🧩' : '🎮'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{game.title}</div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-sky-600 hover:text-sky-700 font-medium">
                View All Games →
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Hangman: The Classic Word Guessing Game</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Hangman is a classic paper-and-pencil word guessing game for two or more players. One player thinks of a word,
            phrase, or sentence and the other tries to guess it by suggesting letters within a certain number of guesses.
            The origins of Hangman are unclear, but it gained widespread popularity in the 20th century as a children&apos;s
            game and educational tool. Today, digital versions like this one make the game accessible to everyone.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
              <h3 className="font-semibold text-sky-800 mb-2">📚 Vocabulary Building</h3>
              <p className="text-sm text-gray-600">Hangman naturally exposes players to new words and reinforces spelling patterns through repeated exposure.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">🔤 Letter Frequency</h3>
              <p className="text-sm text-gray-600">Players learn about common letter patterns and frequency - E, T, A, O, I, N are the most common in English.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">🧩 Pattern Recognition</h3>
              <p className="text-sm text-gray-600">Identifying word patterns with partial letters revealed develops critical thinking skills.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">🎯 Deductive Reasoning</h3>
              <p className="text-sm text-gray-600">Each guess provides information that helps narrow down possibilities through logical elimination.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-100 to-blue-100 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Educational Value</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Teachers worldwide use Hangman as an educational tool because it makes learning vocabulary engaging and fun.
              The game reinforces spelling, teaches word structure, and introduces new words in context. Studies have shown
              that game-based learning improves retention, and Hangman&apos;s simple format makes it effective for students of
              all ages and language proficiency levels.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Strategic Approach</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-sky-500">•</span>
                <span>Start with vowels (A, E, I, O, U) - every word needs them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Try common consonants next (R, S, T, L, N) for maximum information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-500">•</span>
                <span>Use the category hint to narrow down possible words</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Count letters and think of words that match the pattern</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <GameAppMobileMrec2 />



        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
