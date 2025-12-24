'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you play the Memory Card Match game?',
    answer: 'Click on any card to flip it and reveal the symbol underneath. Then click another card to try to find its match. If the two cards have the same symbol, they stay face up. If not, both cards flip back over. Continue until all pairs are matched.',
    order: 1
  },
  {
    id: '2',
    question: 'What are the different difficulty levels?',
    answer: 'There are four difficulty levels: Easy (3×4 grid with 12 cards), Medium (4×4 grid with 16 cards), Hard (4×6 grid with 24 cards), and Expert (6×6 grid with 36 cards). Higher difficulties have more cards to remember.',
    order: 2
  },
  {
    id: '3',
    question: 'What themes are available for the cards?',
    answer: 'You can choose from five themes: Emojis (faces and expressions), Animals (various animal emojis), Fruits (fruit and vegetable emojis), Numbers (number emojis), and Shapes (geometric shapes and colors).',
    order: 3
  },
  {
    id: '4',
    question: 'How is the score calculated?',
    answer: 'Your score is based on three factors: time bonus (faster completion = higher score), move efficiency bonus (fewer moves = higher score), and accuracy bonus (higher match percentage = higher score). Difficulty level multiplies your final score.',
    order: 4
  },
  {
    id: '5',
    question: 'What benefits does playing memory games provide?',
    answer: 'Memory card games help improve concentration, visual memory, and cognitive function. Regular play can enhance pattern recognition, short-term memory retention, and mental agility for all ages.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I pause the game in the middle?',
    answer: 'Yes! Click the Pause button during gameplay to stop the timer and hide the cards. Click Resume when ready to continue. This is useful if you need a break without losing your progress.',
    order: 6
  }
];

interface Card {
  symbol: string;
  id: number;
  flipped: boolean;
  matched: boolean;
}

interface GridSize {
  rows: number;
  cols: number;
  pairs: number;
}

interface MemoryCardsClientProps {
  relatedGames?: Array<{
    href: string;
    title: string;
    description: string;
    color?: string;
    icon?: string;
  }>;
}

const defaultRelatedGames = [
  { href: '/us/tools/games/pattern-memory', title: 'Pattern Memory', description: 'Remember sequences', color: 'bg-purple-500', icon: 'memory' },
  { href: '/us/tools/games/simon-says', title: 'Simon Says', description: 'Follow the pattern', color: 'bg-green-500', icon: 'game' },
  { href: '/us/tools/games/color-memory', title: 'Color Memory', description: 'Match colors', color: 'bg-blue-500', icon: 'puzzle' },
];

const themes = {
  emojis: ['😀', '😊', '🥰', '😎', '🤔', '😴', '🤗', '🥳', '😸', '🐶', '🦊', '🐼', '🦄', '🌟', '🎈', '🎉', '🍕', '🎂'],
  animals: ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧', '🦆'],
  fruits: ['🍎', '🍊', '🍋', '🍌', '🍉', '🍇', '🍓', '🫐', '🍑', '🥭', '🍍', '🥝', '🍅', '🥕', '🌽', '🥒', '🥑', '🍆'],
  numbers: ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟', '0️⃣', '💯', '➕', '➖', '✖️', '➗', '🟰', '💲'],
  shapes: ['🔴', '🟠', '🟡', '🟢', '🔵', '🟣', '⚫', '⚪', '🟤', '🔺', '🔻', '🔸', '🔹', '🔶', '🔷', '⭐', '✨', '💫']
};

const gridSizes: Record<string, GridSize> = {
  easy: { rows: 3, cols: 4, pairs: 6 },
  medium: { rows: 4, cols: 4, pairs: 8 },
  hard: { rows: 4, cols: 6, pairs: 12 },
  expert: { rows: 6, cols: 6, pairs: 18 }
};

const difficultyMultipliers: Record<string, number> = {
  easy: 1,
  medium: 1.5,
  hard: 2,
  expert: 2.5
};

const getGameIcon = (icon: string) => {
  const icons: Record<string, string> = {
    memory: '🧠',
    puzzle: '🧩',
    game: '🎮',
    blocks: '🔲',
    speed: '⚡'
  };
  return icons[icon] || '🎮';
};

export default function MemoryCardsClient({ relatedGames = defaultRelatedGames }: MemoryCardsClientProps) {
  const [difficulty, setDifficulty] = useState('medium');
  const [theme, setTheme] = useState('emojis');
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('memory-cards');

  const webAppSchema = generateWebAppSchema(
    'Memory Card Match Game - Free Online Brain Training',
    'Play Memory Card Match online for free. Test your memory with multiple themes and difficulty levels. Fun brain training game for all ages.',
    'https://economictimes.indiatimes.com/us/tools/games/memory-cards',
    'Game'
  );

  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameTime, setGameTime] = useState('00:00');
  const [accuracy, setAccuracy] = useState(100);
  const [isGameActive, setIsGameActive] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [showSetup, setShowSetup] = useState(true);
  const [showPlay, setShowPlay] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [gridSize, setGridSize] = useState<GridSize>(gridSizes.medium);
  const [totalPairs, setTotalPairs] = useState(8);
  const [bestScore, setBestScore] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [finalStats, setFinalStats] = useState({
    time: '00:00',
    score: 0,
    moves: 0,
    accuracy: 0,
    avgMoveTime: '0.0',
    emoji: '🎉'
  });

  const startTimeRef = useRef<number | null>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('memoryCardsStats');
    if (saved) {
      const stats = JSON.parse(saved);
      setBestScore(stats.bestScore || 0);
      setGamesPlayed(stats.gamesPlayed || 0);
    }
  }, []);

  const generateCards = useCallback((selectedTheme: string, pairs: number) => {
    const availableSymbols = themes[selectedTheme as keyof typeof themes];
    const selectedSymbols = availableSymbols.slice(0, pairs);

    const newCards: Card[] = [];
    selectedSymbols.forEach(symbol => {
      newCards.push({ symbol, id: Math.random(), flipped: false, matched: false });
      newCards.push({ symbol, id: Math.random(), flipped: false, matched: false });
    });

    for (let i = newCards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newCards[i], newCards[j]] = [newCards[j], newCards[i]];
    }

    return newCards;
  }, []);

  const startGame = useCallback(() => {
    const selectedGridSize = gridSizes[difficulty];
    setGridSize(selectedGridSize);
    setTotalPairs(selectedGridSize.pairs);

    const newCards = generateCards(theme, selectedGridSize.pairs);
    setCards(newCards);

    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
    setAccuracy(100);
    startTimeRef.current = Date.now();
    setIsGameActive(true);
    setIsPaused(false);

    setShowSetup(false);
    setShowPlay(true);
    setShowResults(false);

    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    gameTimerRef.current = setInterval(() => {
      if (startTimeRef.current && !isPaused) {
        const elapsed = Date.now() - startTimeRef.current;
        const minutes = Math.floor(elapsed / 60000);
        const seconds = Math.floor((elapsed % 60000) / 1000);
        setGameTime(`${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
      }
    }, 1000);
  }, [difficulty, theme, generateCards, isPaused]);

  const flipCard = useCallback((index: number) => {
    if (!isGameActive || isPaused || flippedCards.length >= 2) return;

    const card = cards[index];
    if (card.flipped || card.matched) return;

    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(prev => prev + 1);

      const [index1, index2] = newFlippedCards;
      const card1 = newCards[index1];
      const card2 = newCards[index2];

      setTimeout(() => {
        const updatedCards = [...newCards];

        if (card1.symbol === card2.symbol) {
          updatedCards[index1].matched = true;
          updatedCards[index2].matched = true;
          setCards(updatedCards);
          setMatchedPairs(prev => prev + 1);
        } else {
          updatedCards[index1].flipped = false;
          updatedCards[index2].flipped = false;
          setCards(updatedCards);
        }

        setFlippedCards([]);
      }, 800);
    }
  }, [isGameActive, isPaused, flippedCards, cards]);

  const pauseGame = useCallback(() => {
    setIsPaused(true);
  }, []);

  const resumeGame = useCallback(() => {
    setIsPaused(false);
  }, []);

  const resetGame = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }
    startGame();
  }, [startGame]);

  const endGame = useCallback(() => {
    setIsGameActive(false);
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    const totalTime = Date.now() - (startTimeRef.current || 0);
    const minutes = Math.floor(totalTime / 60000);
    const seconds = Math.floor((totalTime % 60000) / 1000);
    const finalAccuracy = moves > 0 ? Math.round((matchedPairs / moves) * 100) : 100;
    const avgMoveTime = (totalTime / moves / 1000).toFixed(1);

    const timeBonus = Math.max(0, 300 - Math.floor(totalTime / 1000));
    const moveBonus = Math.max(0, (totalPairs * 3) - moves);
    const accuracyBonus = finalAccuracy * 5;
    const score = Math.round((timeBonus + moveBonus + accuracyBonus) * difficultyMultipliers[difficulty]);

    let emoji = '🎉';
    if (finalAccuracy >= 90 && moves <= totalPairs * 1.5) {
      emoji = '🏆';
    } else if (finalAccuracy >= 80) {
      emoji = '🌟';
    } else if (finalAccuracy >= 70) {
      emoji = '👍';
    } else {
      emoji = '🧠';
    }

    setFinalStats({
      time: `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`,
      score,
      moves,
      accuracy: finalAccuracy,
      avgMoveTime,
      emoji
    });

    // Save stats
    const newGamesPlayed = gamesPlayed + 1;
    const newBestScore = Math.max(bestScore, score);
    setGamesPlayed(newGamesPlayed);
    setBestScore(newBestScore);
    localStorage.setItem('memoryCardsStats', JSON.stringify({
      bestScore: newBestScore,
      gamesPlayed: newGamesPlayed
    }));

    setShowPlay(false);
    setShowResults(true);
  }, [moves, matchedPairs, totalPairs, difficulty, gamesPlayed, bestScore]);

  const resetToSetup = useCallback(() => {
    if (gameTimerRef.current) {
      clearInterval(gameTimerRef.current);
    }

    setIsGameActive(false);
    setShowResults(false);
    setShowSetup(true);
    setShowPlay(false);
  }, []);

  useEffect(() => {
    if (matchedPairs === totalPairs && matchedPairs > 0 && isGameActive) {
      setTimeout(() => endGame(), 800);
    }
  }, [matchedPairs, totalPairs, isGameActive, endGame]);

  useEffect(() => {
    if (moves > 0) {
      const newAccuracy = Math.round((matchedPairs / moves) * 100);
      setAccuracy(newAccuracy);
    }
  }, [moves, matchedPairs]);

  useEffect(() => {
    return () => {
      if (gameTimerRef.current) {
        clearInterval(gameTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-purple-50">
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

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-100 to-purple-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🃏</span>
            <span className="text-rose-600 font-semibold">Memory Cards</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {getH1('Memory Card Match')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Test your memory by matching pairs of cards. The fewer moves, the higher your score!')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Setup */}
              {showSetup && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Challenge</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="easy">Easy (3×4)</option>
                        <option value="medium">Medium (4×4)</option>
                        <option value="hard">Hard (4×6)</option>
                        <option value="expert">Expert (6×6)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Theme</label>
                      <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-rose-500"
                      >
                        <option value="emojis">Emojis 😊</option>
                        <option value="animals">Animals 🐱</option>
                        <option value="fruits">Fruits 🍎</option>
                        <option value="numbers">Numbers 🔢</option>
                        <option value="shapes">Shapes 🔷</option>
                      </select>
                    </div>
                  </div>

                  <button
                    onClick={startGame}
                    className="bg-gradient-to-r from-rose-500 to-purple-500 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-rose-600 hover:to-purple-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {/* Game Play */}
              {showPlay && (
                <div>
                  {/* Stats Bar */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-blue-600 font-medium">Time</div>
                      <div className="text-xl font-bold text-blue-700">{gameTime}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-green-600 font-medium">Matches</div>
                      <div className="text-xl font-bold text-green-700">{matchedPairs}/{totalPairs}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-orange-600 font-medium">Moves</div>
                      <div className="text-xl font-bold text-orange-700">{moves}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-purple-600 font-medium">Accuracy</div>
                      <div className="text-xl font-bold text-purple-700">{accuracy}%</div>
                    </div>
                  </div>

                  {/* Game Board */}
                  <div className="flex justify-center mb-6">
                    <div
                      className="grid gap-2 sm:gap-3"
                      style={{ gridTemplateColumns: `repeat(${gridSize.cols}, minmax(0, 1fr))` }}
                    >
                      {cards.map((card, index) => (
                        <button
                          key={card.id}
                          onClick={() => flipCard(index)}
                          disabled={isPaused}
                          className={`w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-lg flex items-center justify-center text-xl sm:text-2xl md:text-3xl font-bold shadow-md transition-all duration-300 transform hover:scale-105 ${
                            card.matched
                              ? 'bg-green-100 border-2 border-green-400'
                              : card.flipped
                              ? 'bg-white border-2 border-rose-300'
                              : 'bg-gradient-to-br from-rose-400 to-purple-400 text-white cursor-pointer hover:from-rose-500 hover:to-purple-500'
                          }`}
                        >
                          {card.flipped || card.matched ? card.symbol : '?'}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="flex justify-center gap-4">
                    {!isPaused ? (
                      <button
                        onClick={pauseGame}
                        className="px-6 py-2 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition-colors"
                      >
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={resumeGame}
                        className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-colors"
                      >
                        Resume
                      </button>
                    )}
                    <button
                      onClick={resetGame}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
                    >
                      Restart
                    </button>
                  </div>
                </div>
              )}

              {/* Pause Overlay */}
              {isPaused && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl p-8 text-center shadow-2xl">
                    <div className="text-5xl mb-4">⏸️</div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">Game Paused</h3>
                    <button
                      onClick={resumeGame}
                      className="px-8 py-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-purple-600"
                    >
                      Resume Game
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {showResults && (
                <div className="text-center">
                  <div className="text-6xl mb-4">{finalStats.emoji}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Congratulations!</h2>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-gradient-to-br from-rose-50 to-purple-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Time</div>
                      <div className="text-2xl font-bold text-rose-600">{finalStats.time}</div>
                    </div>
                    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Score</div>
                      <div className="text-2xl font-bold text-blue-600">{finalStats.score}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Moves</div>
                      <div className="text-2xl font-bold text-green-600">{finalStats.moves}</div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-amber-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Accuracy</div>
                      <div className="text-2xl font-bold text-orange-600">{finalStats.accuracy}%</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={resetToSetup}
                      className="px-8 py-3 bg-gradient-to-r from-rose-500 to-purple-500 text-white rounded-lg font-semibold hover:from-rose-600 hover:to-purple-600"
                    >
                      Play Again
                    </button>
                    <Link
                      href="/us/tools/games"
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300"
                    >
                      More Games
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Click to Flip</h4>
                    <p className="text-sm text-gray-600">Click any card to reveal its symbol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Find Matches</h4>
                    <p className="text-sm text-gray-600">Match two cards with the same symbol</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Remember Positions</h4>
                    <p className="text-sm text-gray-600">Memorize card locations for fewer moves</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-rose-100 rounded-full flex items-center justify-center text-rose-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Complete Fast</h4>
                    <p className="text-sm text-gray-600">Finish quickly for bonus points</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-rose-700 mb-1">Start from corners</h4>
                  <p className="text-sm text-gray-600">Corner and edge cards are easier to remember</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-1">Create mental map</h4>
                  <p className="text-sm text-gray-600">Associate positions with a mental grid</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-rose-700 mb-1">Work systematically</h4>
                  <p className="text-sm text-gray-600">Reveal cards in a pattern, not randomly</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-purple-700 mb-1">Focus on pairs</h4>
                  <p className="text-sm text-gray-600">When you see a card, look for its match next</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Memory Card Games: Brain Training Fun</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Memory card matching games, also known as Concentration or Pairs, have been a beloved pastime for centuries.
                The game&apos;s simple premise - finding matching pairs of cards - belies its powerful cognitive benefits. Used
                by educators, therapists, and families worldwide, memory games are proven tools for enhancing mental agility,
                concentration, and recall abilities across all age groups.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
                  <h3 className="font-semibold text-rose-800 mb-2">🧠 Memory Enhancement</h3>
                  <p className="text-sm text-gray-600">Regular play strengthens short-term memory and improves the brain&apos;s ability to form and retain new memories.</p>
                </div>
                <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                  <h3 className="font-semibold text-purple-800 mb-2">👁️ Visual Recognition</h3>
                  <p className="text-sm text-gray-600">Players develop stronger visual processing skills by remembering card positions and patterns.</p>
                </div>
                <div className="bg-pink-50 rounded-xl p-4 border border-pink-100">
                  <h3 className="font-semibold text-pink-800 mb-2">⚡ Attention Span</h3>
                  <p className="text-sm text-gray-600">The need to track multiple cards trains sustained attention and focus over extended periods.</p>
                </div>
                <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                  <h3 className="font-semibold text-indigo-800 mb-2">🎯 Strategic Thinking</h3>
                  <p className="text-sm text-gray-600">Optimal play requires planning which cards to flip and in what order to maximize information.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-rose-100 to-purple-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Scientific Benefits</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Neuroscience research has shown that memory games can help maintain cognitive function as we age. Studies
                  indicate that regular engagement with memory-based activities can increase the density of gray matter in
                  brain areas responsible for visual memory and attention. For children, these games help develop crucial
                  executive functions that are essential for academic success.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Tips for Better Memory</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-rose-500">•</span>
                    <span>Create mental associations between card positions and images</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500">•</span>
                    <span>Use the grid system - think of positions as coordinates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-pink-500">•</span>
                    <span>Start from corners and edges - they&apos;re easier to remember</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-indigo-500">•</span>
                    <span>Practice regularly - memory improves with consistent training</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
              <FirebaseFAQs fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <aside className="w-full lg:w-[320px] flex-shrink-0">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<div className="sticky top-6 space-y-6">
              {/* Ad Banner */}
              <AdBanner className="mx-auto" />

              {/* Stats Card */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span>📊</span> Your Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Games Played</span>
                    <span className="font-bold text-gray-800">{gamesPlayed}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Best Score</span>
                    <span className="font-bold text-rose-600">{bestScore}</span>
                  </div>
                </div>
              </div>
{/* Related Games */}
              <div className="bg-white rounded-2xl shadow-lg p-5">
                <h3 className="font-bold text-gray-800 mb-4">Related Games</h3>
                <div className="space-y-3">
                  {relatedGames.map((game, index) => (
                    <Link
                      key={index}
                      href={game.href}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                    >
                      <div className={`w-10 h-10 ${game.color ?? 'bg-gray-500'} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {game.icon ? getGameIcon(game.icon) : '🎮'}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">{game.title}</div>
                        <div className="text-xs text-gray-500">{game.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
