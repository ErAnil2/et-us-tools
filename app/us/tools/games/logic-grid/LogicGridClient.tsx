'use client';

import { useEffect, useState, useRef } from 'react';
import { usePageSEO } from '@/lib/usePageSEO';
import Link from 'next/link';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface Puzzle {
  categories: string[];
  items: string[][];
  solution: { [key: string]: string[] };
  clues: string[];
  story?: string;
}

interface GameRecord {
  bestTime: number;
  fewestHints: number;
  puzzlesSolved: number;
}

const AdBanner = ({ className = '', bannerId }: { className?: string; bannerId: string }) => {
  const [adContent, setAdContent] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/ads?bannerId=${bannerId}`)
      .then(res => res.ok ? res.text() : null)
      .then(setAdContent)
      .catch(() => setAdContent(null));
  }, [bannerId]);

  if (!adContent) {
    return (
      <div className={`bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl flex items-center justify-center border border-indigo-100 ${className}`}>
        <div className="text-center text-indigo-300">
          <div className="text-3xl mb-2">📢</div>
          <div className="text-xs font-medium">Advertisement</div>
        </div>
      </div>
    );
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: adContent }} />;
};

// Puzzle Data
const allPuzzles = {
  mystery: {
    easy: {
      categories: ['Suspect', 'Weapon', 'Room'],
      items: [
        ['Colonel', 'Professor', 'Butler'],
        ['Knife', 'Rope', 'Candlestick'],
        ['Library', 'Kitchen', 'Ballroom']
      ],
      solution: {
        'Colonel': ['Knife', 'Library'],
        'Professor': ['Rope', 'Kitchen'],
        'Butler': ['Candlestick', 'Ballroom']
      },
      clues: [
        "The Colonel was found in the Library.",
        "The Rope was not used in the Library.",
        "The Butler was seen in the Ballroom.",
        "The Candlestick was used in the Ballroom.",
        "The Professor wasn't in the Ballroom."
      ],
      story: "A mysterious crime at the mansion! Match each suspect with their weapon and location."
    },
    medium: {
      categories: ['Suspect', 'Weapon', 'Room', 'Time'],
      items: [
        ['Duke', 'Duchess', 'Earl', 'Baron'],
        ['Poison', 'Dagger', 'Revolver', 'Wrench'],
        ['Study', 'Garden', 'Cellar', 'Tower'],
        ['9 PM', '10 PM', '11 PM', 'Midnight']
      ],
      solution: {
        'Duke': ['Poison', 'Study', '9 PM'],
        'Duchess': ['Dagger', 'Garden', '10 PM'],
        'Earl': ['Revolver', 'Cellar', '11 PM'],
        'Baron': ['Wrench', 'Tower', 'Midnight']
      },
      clues: [
        "The Duke was in the Study at 9 PM.",
        "The Poison was used in the Study.",
        "The Duchess used the Dagger, but not at Midnight.",
        "The Garden incident happened at 10 PM.",
        "The Earl was in the Cellar.",
        "The Revolver was fired at 11 PM.",
        "The Baron was the last one seen, at Midnight.",
        "The Wrench was used in the Tower."
      ],
      story: "Four nobles are suspected. Determine who did what, where, and when!"
    },
    hard: {
      categories: ['Suspect', 'Weapon', 'Room', 'Time', 'Motive'],
      items: [
        ['Lord', 'Lady', 'Count', 'Viscount', 'Marquis'],
        ['Sword', 'Bow', 'Axe', 'Spear', 'Mace'],
        ['Chapel', 'Dungeon', 'Hall', 'Armory', 'Court'],
        ['Dawn', 'Morning', 'Noon', 'Dusk', 'Night'],
        ['Greed', 'Revenge', 'Power', 'Love', 'Fear']
      ],
      solution: {
        'Lord': ['Sword', 'Chapel', 'Dawn', 'Greed'],
        'Lady': ['Bow', 'Dungeon', 'Morning', 'Revenge'],
        'Count': ['Axe', 'Hall', 'Noon', 'Power'],
        'Viscount': ['Spear', 'Armory', 'Dusk', 'Love'],
        'Marquis': ['Mace', 'Court', 'Night', 'Fear']
      },
      clues: [
        "The Lord acted at Dawn, driven by Greed.",
        "The Sword was used in the Chapel.",
        "The Lady sought Revenge with a ranged weapon.",
        "The Bow was used in the Dungeon in the Morning.",
        "The Count desired Power and used the Axe.",
        "The Hall incident occurred at Noon.",
        "The Viscount was motivated by Love.",
        "The Spear was used in the Armory at Dusk.",
        "The Marquis acted out of Fear at Night.",
        "The Mace was used in the Court."
      ],
      story: "A complex web of nobles with weapons, locations, times, and hidden motives!"
    }
  },
  detective: {
    easy: {
      categories: ['Detective', 'Case', 'City'],
      items: [
        ['Holmes', 'Poirot', 'Marple'],
        ['Murder', 'Theft', 'Fraud'],
        ['London', 'Paris', 'Cairo']
      ],
      solution: {
        'Holmes': ['Murder', 'London'],
        'Poirot': ['Theft', 'Paris'],
        'Marple': ['Fraud', 'Cairo']
      },
      clues: [
        "Holmes solved a case in London.",
        "The Murder case was in London.",
        "Poirot was in Paris.",
        "The Theft occurred in Paris.",
        "Marple investigated Fraud."
      ],
      story: "Three famous detectives, three cases, three cities. Who solved what and where?"
    },
    medium: {
      categories: ['Detective', 'Case', 'Clue', 'Suspect'],
      items: [
        ['Bond', 'Bourne', 'Hunt', 'Salt'],
        ['Espionage', 'Sabotage', 'Heist', 'Escape'],
        ['Fingerprint', 'DNA', 'Witness', 'Camera'],
        ['Diplomat', 'Scientist', 'General', 'CEO']
      ],
      solution: {
        'Bond': ['Espionage', 'Fingerprint', 'Diplomat'],
        'Bourne': ['Sabotage', 'DNA', 'Scientist'],
        'Hunt': ['Heist', 'Witness', 'General'],
        'Salt': ['Escape', 'Camera', 'CEO']
      },
      clues: [
        "Bond investigated Espionage using a Fingerprint.",
        "The Diplomat was involved in Bond's case.",
        "Bourne found DNA evidence of Sabotage.",
        "The Scientist was Bourne's suspect.",
        "Hunt solved the Heist with a Witness.",
        "The General was suspected in the Heist.",
        "Salt's case involved Camera footage."
      ],
      story: "Four spies, four missions. Match each agent to their case, clue, and suspect."
    },
    hard: {
      categories: ['Agent', 'Mission', 'Gadget', 'Location', 'Villain'],
      items: [
        ['Alpha', 'Bravo', 'Charlie', 'Delta', 'Echo'],
        ['Rescue', 'Infiltrate', 'Extract', 'Destroy', 'Protect'],
        ['Laser', 'EMP', 'Drone', 'Hack', 'Decoy'],
        ['Moscow', 'Tokyo', 'Berlin', 'Sydney', 'Cairo'],
        ['Ghost', 'Phantom', 'Shadow', 'Spectre', 'Wraith']
      ],
      solution: {
        'Alpha': ['Rescue', 'Laser', 'Moscow', 'Ghost'],
        'Bravo': ['Infiltrate', 'EMP', 'Tokyo', 'Phantom'],
        'Charlie': ['Extract', 'Drone', 'Berlin', 'Shadow'],
        'Delta': ['Destroy', 'Hack', 'Sydney', 'Spectre'],
        'Echo': ['Protect', 'Decoy', 'Cairo', 'Wraith']
      },
      clues: [
        "Alpha's Rescue mission in Moscow targeted Ghost.",
        "The Laser gadget was used in the Rescue mission.",
        "Bravo used an EMP to Infiltrate in Tokyo.",
        "Phantom operates in Tokyo.",
        "Charlie's Extract mission was in Berlin.",
        "The Drone was used against Shadow.",
        "Delta used Hacking skills to Destroy in Sydney.",
        "Spectre was located in Sydney.",
        "Echo's Protect mission was in Cairo.",
        "The Decoy was used against Wraith."
      ],
      story: "Five elite agents on critical missions across the globe!"
    }
  },
  school: {
    easy: {
      categories: ['Student', 'Subject', 'Grade'],
      items: [
        ['Emma', 'Liam', 'Olivia'],
        ['Math', 'Science', 'Art'],
        ['A', 'B', 'C']
      ],
      solution: {
        'Emma': ['Math', 'A'],
        'Liam': ['Science', 'B'],
        'Olivia': ['Art', 'C']
      },
      clues: [
        "Emma got the highest grade.",
        "The Math student got an A.",
        "Liam didn't study Art.",
        "Olivia got a C.",
        "The Science student got a B."
      ],
      story: "Report cards are in! Figure out each student's subject and grade."
    },
    medium: {
      categories: ['Student', 'Subject', 'Teacher', 'Period'],
      items: [
        ['Alex', 'Blake', 'Casey', 'Drew'],
        ['History', 'English', 'Music', 'Drama'],
        ['Mr. Smith', 'Ms. Jones', 'Mr. Lee', 'Ms. Brown'],
        ['1st', '2nd', '3rd', '4th']
      ],
      solution: {
        'Alex': ['History', 'Mr. Smith', '1st'],
        'Blake': ['English', 'Ms. Jones', '2nd'],
        'Casey': ['Music', 'Mr. Lee', '3rd'],
        'Drew': ['Drama', 'Ms. Brown', '4th']
      },
      clues: [
        "Alex has History with Mr. Smith in 1st period.",
        "Ms. Jones teaches English.",
        "Blake has class in 2nd period.",
        "Casey studies Music with Mr. Lee.",
        "Drama is taught in 4th period.",
        "Ms. Brown teaches the last class.",
        "Music class is in 3rd period."
      ],
      story: "Match students to their classes, teachers, and periods!"
    },
    hard: {
      categories: ['Student', 'Major', 'Dorm', 'Sport', 'Club'],
      items: [
        ['Finn', 'Grace', 'Henry', 'Iris', 'Jack'],
        ['Physics', 'Chemistry', 'Biology', 'Math', 'CS'],
        ['North', 'South', 'East', 'West', 'Central'],
        ['Soccer', 'Tennis', 'Swim', 'Track', 'Golf'],
        ['Chess', 'Debate', 'Drama', 'Music', 'Art']
      ],
      solution: {
        'Finn': ['Physics', 'North', 'Soccer', 'Chess'],
        'Grace': ['Chemistry', 'South', 'Tennis', 'Debate'],
        'Henry': ['Biology', 'East', 'Swim', 'Drama'],
        'Iris': ['Math', 'West', 'Track', 'Music'],
        'Jack': ['CS', 'Central', 'Golf', 'Art']
      },
      clues: [
        "Finn majors in Physics, lives in North dorm, and plays Soccer.",
        "The Chess club member studies Physics.",
        "Grace does Chemistry and Tennis.",
        "The Debate member lives in South dorm.",
        "Henry lives in East dorm and swims.",
        "The Drama club meets near the Biology lab.",
        "Iris runs Track and studies Math.",
        "The Music club member lives in West dorm.",
        "Jack is in CS and plays Golf.",
        "The Art club member lives in Central dorm."
      ],
      story: "Campus life puzzle - match students to all their activities!"
    }
  }
};

type Theme = keyof typeof allPuzzles;
type Difficulty = 'easy' | 'medium' | 'hard';

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Logic Grid Calculator?",
    answer: "A Logic Grid Calculator is a free online tool designed to help you quickly and accurately calculate logic grid-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Logic Grid Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Logic Grid Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Logic Grid Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function LogicGridClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('logic-grid');

  const [gameState, setGameState] = useState<'menu' | 'playing' | 'won'>('menu');
  const [theme, setTheme] = useState<Theme>('mystery');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [timer, setTimer] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle | null>(null);
  const [grid, setGrid] = useState<{ [key: string]: 'yes' | 'no' | null }>({});
  const [records, setRecords] = useState<{ [key: string]: GameRecord }>({});
  const [showClues, setShowClues] = useState(true);
  const [selectedClue, setSelectedClue] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const themes = [
    { id: 'mystery' as Theme, name: 'Mystery', icon: '🔮', color: 'from-purple-500 to-indigo-600', light: 'from-purple-50 to-indigo-50', border: 'border-purple-200' },
    { id: 'detective' as Theme, name: 'Detective', icon: '🕵️', color: 'from-slate-500 to-slate-700', light: 'from-slate-50 to-gray-50', border: 'border-slate-200' },
    { id: 'school' as Theme, name: 'School', icon: '🎓', color: 'from-emerald-500 to-teal-600', light: 'from-emerald-50 to-teal-50', border: 'border-emerald-200' }
  ];

  const difficulties = [
    { id: 'easy' as Difficulty, name: 'Easy', grid: '3×3', stars: 1 },
    { id: 'medium' as Difficulty, name: 'Medium', grid: '4×4', stars: 2 },
    { id: 'hard' as Difficulty, name: 'Hard', grid: '5×5', stars: 3 }
  ];

  useEffect(() => {
    const saved = localStorage.getItem('logicGridRecords');
    if (saved) setRecords(JSON.parse(saved));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const startGame = () => {
    const puzzle = allPuzzles[theme][difficulty];
    setCurrentPuzzle(JSON.parse(JSON.stringify(puzzle)));
    setGrid({});
    setHintsUsed(0);
    setTimer(0);
    setSelectedClue(null);
    setShowClues(true);
    setGameState('playing');

    const start = Date.now();
    timerRef.current = setInterval(() => {
      setTimer(Math.floor((Date.now() - start) / 1000));
    }, 1000);
  };

  const toggleCell = (key: string) => {
    setGrid(prev => {
      const current = prev[key];
      const next = current === null || current === undefined ? 'yes' : current === 'yes' ? 'no' : null;
      return { ...prev, [key]: next };
    });
  };

  const checkSolution = () => {
    if (!currentPuzzle) return;

    let correct = 0;
    let total = 0;

    Object.entries(currentPuzzle.solution).forEach(([person, attrs]) => {
      attrs.forEach(attr => {
        total++;
        if (grid[`${person}-${attr}`] === 'yes') correct++;
      });
    });

    if (correct === total) {
      if (timerRef.current) clearInterval(timerRef.current);

      // Save record
      const key = `${theme}-${difficulty}`;
      const current = records[key];
      const newRecord: GameRecord = {
        bestTime: current ? Math.min(current.bestTime, timer) : timer,
        fewestHints: current ? Math.min(current.fewestHints, hintsUsed) : hintsUsed,
        puzzlesSolved: (current?.puzzlesSolved || 0) + 1
      };
      const newRecords = { ...records, [key]: newRecord };
      setRecords(newRecords);
      localStorage.setItem('logicGridRecords', JSON.stringify(newRecords));

      setGameState('won');
    } else {
      alert(`Progress: ${correct}/${total} correct. Keep going!`);
    }
  };

  const formatTime = (s: number) => `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;

  const getStars = () => {
    if (timer < 120 && hintsUsed === 0) return 3;
    if (timer < 300 && hintsUsed <= 2) return 2;
    return 1;
  };

  const currentTheme = themes.find(t => t.id === theme)!;
  const currentRecord = records[`${theme}-${difficulty}`];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${currentTheme.light}`}>
      <div className="max-w-[1200px] mx-auto px-3 py-4">

        {/* MENU STATE */}
        {gameState === 'menu' && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main Menu */}
            <div className="flex-1">
              <div className={`bg-white rounded-3xl p-6 sm:p-8 shadow-xl border ${currentTheme.border}`}>
                {/* Header */}
                <div className="text-center mb-8">
                  <div className={`inline-flex items-center gap-3 bg-gradient-to-r ${currentTheme.color} px-6 py-3 rounded-full mb-4`}>
                    <span className="text-3xl">🧩</span>
                    <span className="text-white font-bold text-lg">Logic Grid</span>
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-gray-800 mb-3">{getH1('Logic Grid Puzzles')}</h1>
                  <p className="text-gray-600 text-sm sm:text-base max-w-md mx-auto">
                    Use deductive reasoning to solve challenging puzzles. Read the clues, eliminate possibilities, and find the solution!
                  </p>
                </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

                {/* Theme Selection */}
                <div className="mb-6">
                  <h3 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">Choose Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {themes.map(t => (
                      <button
                        key={t.id}
                        onClick={() => setTheme(t.id)}
                        className={`relative p-4 rounded-2xl transition-all duration-300 ${
                          theme === t.id
                            ? `bg-gradient-to-br ${t.color} shadow-lg scale-105 text-white`
                            : `bg-gradient-to-br ${t.light} hover:shadow-md border ${t.border}`
                        }`}
                      >
                        <div className="text-3xl mb-2">{t.icon}</div>
                        <div className={`font-semibold text-sm ${theme === t.id ? 'text-white' : 'text-gray-700'}`}>{t.name}</div>
                        {theme === t.id && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                            <span className="text-xs text-white">✓</span>
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Difficulty Selection */}
                <div className="mb-8">
                  <h3 className="text-gray-700 font-semibold mb-3 text-sm uppercase tracking-wider">Difficulty</h3>
                  <div className="grid grid-cols-3 gap-3">
                    {difficulties.map(d => (
                      <button
                        key={d.id}
                        onClick={() => setDifficulty(d.id)}
                        className={`p-4 rounded-2xl transition-all duration-300 border ${
                          difficulty === d.id
                            ? `bg-gradient-to-r ${currentTheme.color} text-white shadow-lg border-transparent`
                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border-gray-200'
                        }`}
                      >
                        <div className="text-lg mb-1">{'⭐'.repeat(d.stars)}</div>
                        <div className="font-bold">{d.name}</div>
                        <div className="text-xs opacity-70">{d.grid} grid</div>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Start Button */}
                <button
                  onClick={startGame}
                  className={`w-full py-4 rounded-2xl font-bold text-lg text-white bg-gradient-to-r ${currentTheme.color} hover:opacity-90 transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]`}
                >
                  🎮 Start Puzzle
                </button>
              </div>
            </div>
{/* Sidebar */}
            <div className="w-full lg:w-[320px] space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner bannerId="logicGridSidebar" className="h-[250px]" />

              {/* Records */}
              <div className={`bg-white rounded-2xl p-4 shadow-lg border ${currentTheme.border}`}>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <span>🏆</span> Your Records
                </h3>
                {currentRecord ? (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Best Time</span>
                      <span className="text-gray-800 font-bold">{formatTime(currentRecord.bestTime)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Fewest Hints</span>
                      <span className="text-gray-800 font-bold">{currentRecord.fewestHints}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Puzzles Solved</span>
                      <span className="text-gray-800 font-bold">{currentRecord.puzzlesSolved}</span>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm italic">No records for this puzzle yet</p>
                )}
              </div>

              {/* How to Play */}
              <div className={`bg-white rounded-2xl p-4 shadow-lg border ${currentTheme.border}`}>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <span>📖</span> How to Play
                </h3>
                <ul className="text-gray-600 text-sm space-y-2">
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Read each clue carefully</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Click cells to mark Yes/No</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Each row has exactly one ✓</li>
                  <li className="flex gap-2"><span className="text-green-500">✓</span> Use elimination logic</li>
                </ul>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

              {/* More Games */}
              <div className={`bg-white rounded-2xl p-4 shadow-lg border ${currentTheme.border}`}>
                <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
                  <span>🎮</span> More Games
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { href: '/us/tools/games/number-sequence', icon: '🔢', name: 'Number Sequence' },
                    { href: '/us/tools/games/crossword', icon: '📝', name: 'Crossword' },
                    { href: '/us/tools/games/memory-cards', icon: '🃏', name: 'Memory' },
                    { href: '/us/tools/games/2048-game', icon: '🎯', name: '2048' }
                  ].map(game => (
                    <Link key={game.href} href={game.href} className="flex items-center gap-2 p-2 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                      <span>{game.icon}</span>
                      <span className="text-gray-700 text-sm">{game.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLAYING STATE */}
        {gameState === 'playing' && currentPuzzle && (
          <div className="flex flex-col h-[calc(100vh-40px)]">
            {/* Header Bar - Subtle colors */}
            <div className="bg-white rounded-xl p-3 mb-3 flex items-center justify-between shadow-sm border border-gray-200">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{currentTheme.icon}</span>
                <div>
                  <div className="text-gray-800 font-bold">{currentTheme.name}</div>
                  <div className="text-gray-500 text-xs capitalize">{difficulty} Mode</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">⏱</span>
                  <span className="text-gray-800 font-mono font-bold text-lg">{formatTime(timer)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-sm">💡</span>
                  <span className="text-gray-800 font-bold text-lg">{hintsUsed}</span>
                </div>
                <button
                  onClick={() => { if (timerRef.current) clearInterval(timerRef.current); setGameState('menu'); }}
                  className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <span className="text-gray-600">✕</span>
                </button>
              </div>
            </div>

            {/* Full Width Game Area */}
            <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col">
              {/* Story */}
              {currentPuzzle.story && (
                <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                  <p className="text-gray-600 text-sm italic text-center">{currentPuzzle.story}</p>
                </div>
              )}

              {/* Grid + Clues - Full Width */}
              <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
                {/* Clues Panel */}
                <div className={`${showClues ? 'lg:w-80' : 'lg:w-10'} border-b lg:border-b-0 lg:border-r border-gray-100 transition-all duration-300 bg-gray-50/50`}>
                  <div className="h-full flex flex-col">
                    <div className="flex items-center justify-between p-3 border-b border-gray-100">
                      <span className={`text-gray-700 font-medium text-sm ${!showClues && 'lg:hidden'}`}>📝 Clues</span>
                      <button
                        onClick={() => setShowClues(!showClues)}
                        className="p-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                      >
                        <span className="text-gray-500 text-xs">{showClues ? '◀' : '▶'}</span>
                      </button>
                    </div>
                    {showClues && (
                      <div className="flex-1 overflow-y-auto p-3 space-y-1.5 max-h-[120px] lg:max-h-none">
                        {currentPuzzle.clues.map((clue, i) => (
                          <button
                            key={i}
                            onClick={() => setSelectedClue(selectedClue === i ? null : i)}
                            className={`w-full text-left p-2 rounded-lg text-sm transition-all ${
                              selectedClue === i
                                ? 'bg-blue-50 text-blue-800 border border-blue-200'
                                : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100'
                            }`}
                          >
                            <span className="text-gray-400 font-medium mr-1">{i + 1}.</span>
                            {clue}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Grid - Centered */}
                <div className="flex-1 flex flex-col p-4 overflow-hidden bg-white">
                  <div className="flex-1 overflow-auto flex items-start justify-center">
                    <table className="border-collapse">
                      <thead>
                        <tr>
                          <th className="p-2.5 bg-gray-100 text-gray-700 text-xs font-semibold sticky top-0 z-10 border border-gray-200 rounded-tl-lg">
                            {currentPuzzle.categories[0]}
                          </th>
                          {currentPuzzle.items.slice(1).flat().map((item, i) => (
                            <th key={i} className="p-2.5 bg-gray-50 text-gray-600 text-[11px] font-medium sticky top-0 z-10 min-w-[60px] border border-gray-200">
                              {item}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {currentPuzzle.items[0].map((person, pIdx) => (
                          <tr key={pIdx}>
                            <th className="p-2.5 bg-gray-50 text-gray-700 text-xs font-medium text-left border border-gray-200">
                              {person}
                            </th>
                            {currentPuzzle.items.slice(1).flat().map((item, iIdx) => {
                              const key = `${person}-${item}`;
                              const val = grid[key];
                              return (
                                <td key={iIdx} className="p-1 border border-gray-100 text-center bg-white">
                                  <button
                                    onClick={() => toggleCell(key)}
                                    className={`w-9 h-9 rounded-md font-bold text-sm transition-all ${
                                      val === 'yes'
                                        ? 'bg-emerald-500 text-white'
                                        : val === 'no'
                                        ? 'bg-rose-400 text-white'
                                        : 'bg-gray-50 hover:bg-gray-100 text-gray-300'
                                    }`}
                                  >
                                    {val === 'yes' ? '✓' : val === 'no' ? '✕' : ''}
                                  </button>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Controls - Bottom */}
                  <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <div className="flex gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-emerald-500 rounded text-white flex items-center justify-center text-[10px]">✓</div>
                        <span>Yes</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-rose-400 rounded text-white flex items-center justify-center text-[10px]">✕</div>
                        <span>No</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-4 h-4 bg-gray-50 rounded border border-gray-200"></div>
                        <span>Empty</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setGrid({})}
                        className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                      >
                        Reset
                      </button>
                      <button
                        onClick={checkSolution}
                        className="px-5 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-gray-700 transition-all"
                      >
                        Check Solution
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Info Below Game Area */}
            <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
              <div className="flex items-center gap-4">
                <span>Click cells to toggle: Empty → ✓ → ✕ → Empty</span>
                {currentRecord && (
                  <span className="text-gray-500">Best: {formatTime(currentRecord.bestTime)}</span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Link href="/us/tools/games/number-sequence" className="hover:text-gray-600 transition-colors">Number Seq</Link>
                <Link href="/us/tools/games/crossword" className="hover:text-gray-600 transition-colors">Crossword</Link>
                <Link href="/us/tools/games/memory-cards" className="hover:text-gray-600 transition-colors">Memory</Link>
              </div>
            </div>
          </div>
        )}

        {/* WON STATE */}
        {gameState === 'won' && (
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
              <div className={`bg-white rounded-3xl p-8 shadow-xl border ${currentTheme.border} text-center`}>
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Puzzle Solved!</h2>
                <div className="text-4xl mb-6">
                  {'⭐'.repeat(getStars())}{'☆'.repeat(3 - getStars())}
                </div>

                <div className={`bg-gradient-to-r ${currentTheme.light} rounded-2xl p-6 mb-6 max-w-sm mx-auto border ${currentTheme.border}`}>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-3xl font-bold text-gray-800">{formatTime(timer)}</div>
                      <div className="text-gray-500 text-sm">Time</div>
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-gray-800">{hintsUsed}</div>
                      <div className="text-gray-500 text-sm">Hints Used</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button
                    onClick={startGame}
                    className={`px-6 py-3 bg-gradient-to-r ${currentTheme.color} text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-lg`}
                  >
                    🔄 Play Again
                  </button>
                  <button
                    onClick={() => setGameState('menu')}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-2xl font-medium hover:bg-gray-200 transition-colors border border-gray-200"
                  >
                    🏠 Main Menu
                  </button>
                </div>
              </div>
            </div>

            <div className="w-full lg:w-[320px] space-y-4">
              <AdBanner bannerId="logicGridSidebar" className="h-[250px]" />

              <div className={`bg-white rounded-2xl p-4 shadow-lg border ${currentTheme.border}`}>
                <h3 className="text-gray-800 font-semibold mb-3">🎮 Try More Games</h3>
                <div className="space-y-2">
                  {[
                    { href: '/us/tools/games/number-sequence', icon: '🔢', name: 'Number Sequence' },
                    { href: '/us/tools/games/crossword', icon: '📝', name: 'Crossword' },
                    { href: '/us/tools/games/memory-cards', icon: '🃏', name: 'Memory Cards' },
                    { href: '/us/tools/games/2048-game', icon: '🎯', name: '2048 Game' }
                  ].map(game => (
                    <Link key={game.href} href={game.href} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200">
                      <span className="text-xl">{game.icon}</span>
                      <span className="text-gray-700">{game.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQs Section */}
        <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="logic-grid" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </div>
  );
}
