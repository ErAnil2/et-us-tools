'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
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
    question: 'What is Word Scramble?',
    answer: 'Word Scramble is a word puzzle game where you rearrange jumbled letters to form valid words. It tests your vocabulary, spelling skills, and pattern recognition abilities.',
    order: 1
  },
  {
    id: '2',
    question: 'How do I play Word Scramble?',
    answer: 'Click on the scrambled letters in the correct order to spell the hidden word. You can click letters to select them, use Clear to start over, or use power-ups like Hint, Shuffle, or Skip.',
    order: 2
  },
  {
    id: '3',
    question: 'What are the different game modes?',
    answer: 'There are three game modes: Classic (solve 10 words per level to advance), Timed (solve as many words as possible in 60 seconds), and Zen (no timer, play at your own pace).',
    order: 3
  },
  {
    id: '4',
    question: 'How does the scoring system work?',
    answer: 'Points are calculated based on word length (10 points per letter), streak bonus (5 points per consecutive correct answer), and difficulty multiplier (Easy ×1, Medium ×1.5, Hard ×2).',
    order: 4
  },
  {
    id: '5',
    question: 'What categories are available?',
    answer: 'Word Scramble offers six categories: Animals, Food, Science, Technology, Sports, and Mixed (variety of words from all categories).',
    order: 5
  },
  {
    id: '6',
    question: 'Is my progress saved?',
    answer: 'Yes! Your statistics including games played, words solved, best streak, and achievements are automatically saved in your browser.',
    order: 6
  }
];

interface WordScrambleClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

interface Stats {
  gamesPlayed: number;
  totalWords: number;
  bestStreak: number;
  bestScore: number;
  totalScore: number;
}

// Word lists organized by category and difficulty
const wordLists = {
  animals: {
    easy: ['cat', 'dog', 'fish', 'bird', 'lion', 'bear', 'wolf', 'deer', 'frog', 'duck', 'cow', 'pig', 'ant', 'bat', 'owl'],
    medium: ['elephant', 'giraffe', 'penguin', 'dolphin', 'butterfly', 'kangaroo', 'raccoon', 'octopus', 'gorilla', 'cheetah'],
    hard: ['rhinoceros', 'hippopotamus', 'chimpanzee', 'chameleon', 'alligator', 'flamingo', 'orangutan', 'armadillo']
  },
  food: {
    easy: ['apple', 'bread', 'pizza', 'cake', 'rice', 'soup', 'meat', 'egg', 'milk', 'fish', 'corn', 'bean', 'lime'],
    medium: ['sandwich', 'chocolate', 'spaghetti', 'hamburger', 'pancake', 'broccoli', 'avocado', 'cucumber', 'mushroom'],
    hard: ['marshmallow', 'cauliflower', 'watermelon', 'pineapple', 'strawberry', 'pomegranate', 'cantaloupe']
  },
  science: {
    easy: ['atom', 'cell', 'star', 'moon', 'wave', 'mass', 'heat', 'force', 'light', 'rock', 'soil'],
    medium: ['gravity', 'molecule', 'electron', 'neutron', 'nucleus', 'protein', 'bacteria', 'volcano', 'crystal'],
    hard: ['chromosome', 'photosynthesis', 'evolution', 'ecosystem', 'atmosphere', 'metabolism', 'telescope']
  },
  technology: {
    easy: ['code', 'data', 'file', 'app', 'web', 'chip', 'byte', 'wifi', 'link', 'blog', 'site'],
    medium: ['computer', 'software', 'hardware', 'internet', 'database', 'algorithm', 'download', 'keyboard'],
    hard: ['artificial', 'blockchain', 'encryption', 'programming', 'cybersecurity', 'automation']
  },
  sports: {
    easy: ['golf', 'swim', 'run', 'jump', 'kick', 'ball', 'goal', 'race', 'team', 'win', 'game'],
    medium: ['football', 'baseball', 'swimming', 'cycling', 'skating', 'archery', 'climbing', 'surfing'],
    hard: ['basketball', 'volleyball', 'badminton', 'wrestling', 'gymnastics', 'skateboard', 'snowboard']
  },
  random: {
    easy: ['house', 'phone', 'chair', 'table', 'book', 'music', 'happy', 'world', 'dream', 'peace', 'smile'],
    medium: ['computer', 'keyboard', 'bicycle', 'holiday', 'present', 'journey', 'mystery', 'freedom', 'harmony'],
    hard: ['adventure', 'celebration', 'discovery', 'imagination', 'wonderful', 'inspiration', 'creativity']
  }
};

type Category = keyof typeof wordLists;
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'classic' | 'timed' | 'zen';

export default function WordScrambleClient({ relatedGames = defaultRelatedGames }: WordScrambleClientProps) {
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState<string[]>([]);
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);
  const [userAnswer, setUserAnswer] = useState('');

  const [category, setCategory] = useState<Category>('random');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('classic');

  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);
  const [wordsCompleted, setWordsCompleted] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [isPlaying, setIsPlaying] = useState(false);

  const [hints, setHints] = useState(3);
  const [shuffles, setShuffles] = useState(3);
  const [revealedLetters, setRevealedLetters] = useState<number[]>([]);

  const [message, setMessage] = useState({ text: '', type: '' });
  const [showMessage, setShowMessage] = useState(false);
  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalWords: 0,
    bestStreak: 0,
    bestScore: 0,
    totalScore: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('word-scramble');

  const webAppSchema = generateWebAppSchema(
    'Word Scramble - Free Online Anagram Puzzle Game',
    'Play Word Scramble online for free. Unscramble letters to form words. Multiple categories, difficulty levels, and power-ups. Train your brain!',
    'https://economictimes.indiatimes.com/us/tools/games/word-scramble',
    'Game'
  );

  const categories = [
    { id: 'animals' as Category, name: 'Animals', icon: '🐾' },
    { id: 'food' as Category, name: 'Food', icon: '🍎' },
    { id: 'science' as Category, name: 'Science', icon: '🔬' },
    { id: 'technology' as Category, name: 'Tech', icon: '💻' },
    { id: 'sports' as Category, name: 'Sports', icon: '⚽' },
    { id: 'random' as Category, name: 'Mixed', icon: '🎲' }
  ];

  const difficulties = [
    { id: 'easy' as Difficulty, name: 'Easy', desc: '3-5 letters' },
    { id: 'medium' as Difficulty, name: 'Medium', desc: '6-8 letters' },
    { id: 'hard' as Difficulty, name: 'Hard', desc: '9+ letters' }
  ];

  const gameModes = [
    { id: 'classic' as GameMode, name: 'Classic', icon: '🎮', desc: '10 words/level' },
    { id: 'timed' as GameMode, name: 'Timed', icon: '⏱️', desc: '60 seconds' },
    { id: 'zen' as GameMode, name: 'Zen', icon: '🧘', desc: 'No timer' }
  ];

  // Load stats
  useEffect(() => {
    const saved = localStorage.getItem('wordScrambleStats');
    if (saved) {
      setStats(JSON.parse(saved));
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Timer
  useEffect(() => {
    if (isPlaying && gameMode === 'timed' && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    } else if (isPlaying && gameMode === 'timed' && timeLeft <= 0) {
      endGame();
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [isPlaying, gameMode, timeLeft]);

  const scrambleWord = useCallback((word: string): string[] => {
    const letters = word.split('');
    for (let i = letters.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [letters[i], letters[j]] = [letters[j], letters[i]];
    }
    if (letters.join('') === word && word.length > 2) {
      return scrambleWord(word);
    }
    return letters;
  }, []);

  const nextWord = useCallback(() => {
    const list = wordLists[category][difficulty];
    const word = list[Math.floor(Math.random() * list.length)].toLowerCase();
    setCurrentWord(word);
    setScrambledLetters(scrambleWord(word));
    setSelectedLetters([]);
    setUserAnswer('');
    setRevealedLetters([]);
    setShowMessage(false);
  }, [category, difficulty, scrambleWord]);

  const startGame = () => {
    setIsPlaying(true);
    setScore(0);
    setLevel(1);
    setStreak(0);
    setWordsCompleted(0);
    setTimeLeft(gameMode === 'timed' ? 60 : 0);
    setHints(3);
    setShuffles(3);
    nextWord();
  };

  const displayMessage = (text: string, type: string) => {
    setMessage({ text, type });
    setShowMessage(true);
    setTimeout(() => setShowMessage(false), 1500);
  };

  const handleLetterClick = (index: number) => {
    if (selectedLetters.includes(index)) {
      const newSelected = selectedLetters.filter(i => i !== index);
      setSelectedLetters(newSelected);
      setUserAnswer(newSelected.map(i => scrambledLetters[i]).join(''));
    } else {
      const newSelected = [...selectedLetters, index];
      setSelectedLetters(newSelected);
      setUserAnswer(newSelected.map(i => scrambledLetters[i]).join(''));
    }
  };

  const clearSelection = () => {
    setSelectedLetters([]);
    setUserAnswer('');
  };

  const submitAnswer = () => {
    if (userAnswer.toLowerCase() === currentWord) {
      const basePoints = currentWord.length * 10;
      const streakBonus = streak * 5;
      const diffMultiplier = difficulty === 'easy' ? 1 : difficulty === 'medium' ? 1.5 : 2;
      const points = Math.round((basePoints + streakBonus) * diffMultiplier);

      setScore(s => s + points);
      setStreak(s => s + 1);
      setWordsCompleted(w => w + 1);

      displayMessage(`+${points} points!`, 'success');

      if (gameMode === 'classic' && (wordsCompleted + 1) % 10 === 0) {
        setLevel(l => l + 1);
      }

      if (gameMode === 'timed') {
        setTimeLeft(t => t + 5);
      }

      setTimeout(nextWord, 800);
    } else {
      setStreak(0);
      displayMessage('Try again!', 'error');
      setSelectedLetters([]);
      setUserAnswer('');
    }
  };

  const useHint = () => {
    if (hints <= 0) return;
    for (let i = 0; i < currentWord.length; i++) {
      if (!revealedLetters.includes(i)) {
        setRevealedLetters(r => [...r, i]);
        setHints(h => h - 1);
        break;
      }
    }
  };

  const useShuffle = () => {
    if (shuffles <= 0) return;
    setScrambledLetters(scrambleWord(currentWord));
    setSelectedLetters([]);
    setUserAnswer('');
    setShuffles(s => s - 1);
  };

  const skipWord = () => {
    setStreak(0);
    displayMessage(`The word was: ${currentWord.toUpperCase()}`, 'info');
    setTimeout(nextWord, 1500);
  };

  const endGame = useCallback(() => {
    setIsPlaying(false);
    if (timerRef.current) clearTimeout(timerRef.current);

    const newStats: Stats = {
      gamesPlayed: stats.gamesPlayed + 1,
      totalWords: stats.totalWords + wordsCompleted,
      bestStreak: Math.max(stats.bestStreak, streak),
      bestScore: Math.max(stats.bestScore, score),
      totalScore: stats.totalScore + score
    };

    setStats(newStats);
    localStorage.setItem('wordScrambleStats', JSON.stringify(newStats));
  }, [stats, wordsCompleted, streak, score]);

  const currentCat = categories.find(c => c.id === category);

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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">🔤</span>
            <span className="text-white font-semibold text-sm">Word Puzzle</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent mb-2">
            {getH1('Word Scramble Game')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Unscramble the letters to form words! Test your vocabulary and spelling skills.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout: Game + Sidebar */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1 min-w-0">
            {/* Game Container */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-orange-100">
              {/* Score Bar - Mobile/Tablet */}
              <div className="grid grid-cols-4 gap-2 sm:gap-3 mb-4 lg:hidden">
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">SCORE</div>
                  <div className="text-lg sm:text-xl font-bold">{score}</div>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">STREAK</div>
                  <div className="text-lg sm:text-xl font-bold">{streak}🔥</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">LEVEL</div>
                  <div className="text-lg sm:text-xl font-bold">{level}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">WORDS</div>
                  <div className="text-lg sm:text-xl font-bold">{wordsCompleted}</div>
                </div>
              </div>

              {!isPlaying ? (
                /* Game Setup */
                <div className="space-y-4">
                  {/* Game Mode Selection */}
                  <div>
                    <div className="text-sm font-semibold text-gray-700 mb-2">Game Mode</div>
                    <div className="grid grid-cols-3 gap-2">
                      {gameModes.map(mode => (
                        <button
                          key={mode.id}
                          onClick={() => setGameMode(mode.id)}
                          className={`p-3 rounded-xl transition-all text-center ${
                            gameMode === mode.id
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
                              : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                          }`}
                        >
                          <div className="text-lg">{mode.icon}</div>
                          <div className="text-xs font-semibold">{mode.name}</div>
                          <div className="text-[10px] opacity-70">{mode.desc}</div>
                        </button>
                      ))}
                    </div>
                  </div>

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
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
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
                              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md'
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
                    className="w-full py-3 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 transition-all shadow-lg hover:shadow-xl active:scale-[0.98]"
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
                    {gameMode === 'timed' && (
                      <div className={`font-bold ${timeLeft <= 10 ? 'text-red-500' : 'text-gray-700'}`}>
                        ⏱️ {timeLeft}s
                      </div>
                    )}
                    <button
                      onClick={endGame}
                      className="text-gray-500 hover:text-gray-700 px-2"
                    >
                      ✕ End
                    </button>
                  </div>

                  {/* Hint Display */}
                  {revealedLetters.length > 0 && (
                    <div className="mb-4 text-center">
                      <div className="flex gap-1 justify-center">
                        {currentWord.split('').map((letter, i) => (
                          <div
                            key={i}
                            className={`w-8 h-8 rounded flex items-center justify-center text-lg font-bold ${
                              revealedLetters.includes(i)
                                ? 'bg-amber-100 text-amber-700 border-2 border-amber-300'
                                : 'bg-gray-100 text-gray-300'
                            }`}
                          >
                            {revealedLetters.includes(i) ? letter.toUpperCase() : '?'}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Message */}
                  {showMessage && (
                    <div className={`mb-4 text-center px-6 py-2 rounded-full font-bold text-sm inline-block w-full ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' :
                      message.type === 'error' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>
                      {message.text}
                    </div>
                  )}

                  {/* Scrambled Letters */}
                  <div className="flex justify-center mb-4">
                    <div className="flex flex-wrap gap-2 justify-center max-w-md">
                      {scrambledLetters.map((letter, index) => (
                        <button
                          key={index}
                          onClick={() => handleLetterClick(index)}
                          disabled={selectedLetters.includes(index)}
                          className={`w-11 h-11 sm:w-14 sm:h-14 rounded-xl text-xl sm:text-2xl font-bold transition-all duration-200 ${
                            selectedLetters.includes(index)
                              ? 'bg-gray-200 text-gray-400 scale-90'
                              : 'bg-gradient-to-br from-amber-400 to-orange-500 text-white shadow-md hover:shadow-lg hover:scale-105 active:scale-95'
                          }`}
                        >
                          {letter.toUpperCase()}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* User Answer - Text Input */}
                  <div className="mb-4">
                    <input
                      type="text"
                      value={userAnswer}
                      onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        setUserAnswer(value);
                        // Update selected letters based on typed input
                        const newSelected: number[] = [];
                        const usedIndices = new Set<number>();
                        for (const char of value) {
                          const idx = scrambledLetters.findIndex((letter, i) =>
                            letter.toLowerCase() === char && !usedIndices.has(i)
                          );
                          if (idx !== -1) {
                            newSelected.push(idx);
                            usedIndices.add(idx);
                          }
                        }
                        setSelectedLetters(newSelected);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && userAnswer.length === currentWord.length) {
                          submitAnswer();
                        }
                      }}
                      placeholder="Type your answer or click letters above..."
                      className="w-full px-4 py-3 text-xl text-center font-bold uppercase tracking-widest bg-white rounded-xl border-2 border-amber-200 focus:border-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-200 placeholder:text-gray-400 placeholder:text-sm placeholder:normal-case placeholder:tracking-normal"
                      autoComplete="off"
                      autoCapitalize="off"
                      spellCheck="false"
                    />
                    {/* Visual letter display */}
                    {userAnswer && (
                      <div className="mt-2 flex items-center justify-center gap-1 flex-wrap">
                        {userAnswer.split('').map((letter, i) => (
                          <span key={i} className="w-9 h-9 bg-amber-50 rounded-lg flex items-center justify-center text-lg font-bold text-amber-700 shadow-sm border border-amber-200">
                            {letter.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-wrap justify-center">
                    <button onClick={clearSelection} disabled={selectedLetters.length === 0}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 text-sm">
                      Clear
                    </button>
                    <button onClick={useHint} disabled={hints <= 0}
                      className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg font-medium hover:bg-blue-200 transition-colors disabled:opacity-50 text-sm">
                      💡 Hint ({hints})
                    </button>
                    <button onClick={useShuffle} disabled={shuffles <= 0}
                      className="px-3 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 transition-colors disabled:opacity-50 text-sm">
                      🔀 Shuffle ({shuffles})
                    </button>
                    <button onClick={skipWord}
                      className="px-3 py-2 bg-gray-100 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition-colors text-sm">
                      ⏭️ Skip
                    </button>
                    <button onClick={submitAnswer} disabled={userAnswer.length !== currentWord.length}
                      className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-bold hover:from-green-600 hover:to-emerald-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                      ✓ Submit
                    </button>
                  </div>
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
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Select Settings</div>
                    <div className="text-gray-600">Choose category, difficulty, and mode</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Click Letters</div>
                    <div className="text-gray-600">Tap scrambled letters in correct order</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Use Power-ups</div>
                    <div className="text-gray-600">Hints reveal letters, Shuffle rearranges</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-amber-600 font-bold">4</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Build Streaks</div>
                    <div className="text-gray-600">Consecutive correct answers = bonus!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Pro Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Look for Patterns</div>
                  <div className="text-gray-600">Find common prefixes like "un-" or suffixes like "-ing"</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Start with Vowels</div>
                  <div className="text-gray-600">Identify A, E, I, O, U first to see word structure</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Use Category Hint</div>
                  <div className="text-gray-600">The category tells you what type of word to expect</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Save Power-ups</div>
                  <div className="text-gray-600">Use hints strategically on harder words</div>
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
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Score</span>
                  <span className="text-2xl font-bold text-amber-600">{score}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-orange-50 to-red-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Streak</span>
                  <span className="text-2xl font-bold text-orange-600">{streak} 🔥</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Level</div>
                    <div className="text-xl font-bold text-gray-700">{level}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Words</div>
                    <div className="text-xl font-bold text-gray-700">{wordsCompleted}</div>
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
                  <span className="text-gray-600">Games Played</span>
                  <span className="text-gray-800 font-bold">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Words Solved</span>
                  <span className="text-gray-800 font-bold">{stats.totalWords}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="text-orange-600 font-bold">{stats.bestStreak} 🔥</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Best Score</span>
                  <span className="text-amber-600 font-bold">{stats.bestScore}</span>
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
                      {game.icon === 'word' ? '📝' : game.icon === 'speed' ? '⌨️' : game.icon === 'puzzle' ? '🧩' : '🎮'}
                    </div>
                    <div>
                      <div className="font-semibold text-gray-800 text-sm">{game.title}</div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-amber-600 hover:text-amber-700 font-medium">
                View All Games →
              </Link>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Word Scramble: The Classic Word Puzzle</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Word scramble puzzles, also known as anagrams or jumbled words, have been popular word games for centuries.
            The objective is simple: rearrange a set of scrambled letters to form a valid word. This deceptively simple
            premise offers a powerful workout for your brain, combining vocabulary knowledge, pattern recognition, and
            problem-solving skills into an engaging mental exercise suitable for all ages.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2">📚 Vocabulary Expansion</h3>
              <p className="text-sm text-gray-600">Word scramble games expose you to new words and reinforce spelling of words you already know.</p>
            </div>
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2">🧠 Cognitive Training</h3>
              <p className="text-sm text-gray-600">Unscrambling letters exercises your brain&apos;s pattern recognition and problem-solving abilities.</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-2">⚡ Mental Speed</h3>
              <p className="text-sm text-gray-600">Timed challenges help improve processing speed and mental agility over time.</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">🎯 Focus & Concentration</h3>
              <p className="text-sm text-gray-600">Solving word puzzles requires sustained attention and helps improve concentration skills.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-amber-100 to-orange-100 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Educational Benefits</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              Teachers and educators widely use word scramble games as learning tools because they make vocabulary
              practice engaging and fun. Research shows that active engagement with words - manipulating letters,
              recognizing patterns, and recalling spellings - leads to better retention than passive reading. Word
              scrambles are particularly effective for English language learners and students building vocabulary skills.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Solving Strategies</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-amber-500">•</span>
                <span>Look for common letter patterns like -ing, -tion, -ed, or -er</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-orange-500">•</span>
                <span>Identify vowels first - every word needs at least one vowel</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Try different starting consonants with the vowels you&apos;ve identified</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Use the category hint to narrow down possible words</span>
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
