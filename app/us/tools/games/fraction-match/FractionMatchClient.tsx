'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface FractionMatchClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

interface Card {
  id: string;
  type: 'fraction' | 'decimal';
  value: string;
  pairId: number;
  matched: boolean;
}

interface FractionData {
  fraction: string;
  decimal: number;
  display: string;
}

interface Stats {
  gamesPlayed: number;
  totalMatches: number;
  bestScore: number;
  bestStreak: number;
  bestAccuracy: number;
}

type GamePhase = 'menu' | 'play' | 'result';
type Difficulty = 'easy' | 'medium' | 'hard';
type GameMode = 'matching' | 'quiz' | 'timed';

const fractionSets = {
  easy: [
    { fraction: '1/2', decimal: 0.5, display: '0.5' },
    { fraction: '1/4', decimal: 0.25, display: '0.25' },
    { fraction: '3/4', decimal: 0.75, display: '0.75' },
    { fraction: '1/5', decimal: 0.2, display: '0.2' },
    { fraction: '2/5', decimal: 0.4, display: '0.4' },
    { fraction: '3/5', decimal: 0.6, display: '0.6' },
    { fraction: '4/5', decimal: 0.8, display: '0.8' },
    { fraction: '1/10', decimal: 0.1, display: '0.1' }
  ],
  medium: [
    { fraction: '1/3', decimal: 0.333, display: '0.333' },
    { fraction: '2/3', decimal: 0.667, display: '0.667' },
    { fraction: '1/6', decimal: 0.167, display: '0.167' },
    { fraction: '5/6', decimal: 0.833, display: '0.833' },
    { fraction: '1/8', decimal: 0.125, display: '0.125' },
    { fraction: '3/8', decimal: 0.375, display: '0.375' },
    { fraction: '5/8', decimal: 0.625, display: '0.625' },
    { fraction: '7/8', decimal: 0.875, display: '0.875' }
  ],
  hard: [
    { fraction: '2/7', decimal: 0.286, display: '0.286' },
    { fraction: '3/7', decimal: 0.429, display: '0.429' },
    { fraction: '5/7', decimal: 0.714, display: '0.714' },
    { fraction: '1/9', decimal: 0.111, display: '0.111' },
    { fraction: '2/9', decimal: 0.222, display: '0.222' },
    { fraction: '4/9', decimal: 0.444, display: '0.444' },
    { fraction: '7/12', decimal: 0.583, display: '0.583' },
    { fraction: '11/16', decimal: 0.688, display: '0.688' }
  ]
};

const fallbackFaqs = [
  { id: 'faq-1', question: "How does Fraction Match help learn fractions?", answer: "By matching fractions with their decimal equivalents, you build mental connections between these two representations of the same value, making conversion easier over time.", order: 1 },
  { id: 'faq-2', question: "What are the different difficulty levels?", answer: "Easy has common fractions like halves and quarters. Medium introduces thirds, sixths, and eighths. Hard includes sevenths, ninths, and other complex fractions.", order: 2 },
  { id: 'faq-3', question: "How does the scoring system work?", answer: "You earn points for each correct match. Consecutive matches build a streak bonus. Higher difficulties give more points. Speed Match mode adds time pressure.", order: 3 },
  { id: 'faq-' + Math.random().toString(36).substr(2, 9), question: "What's the best strategy for this game?",
    answer: "Start by memorizing common equivalents (1/2 = 0.5, 1/4 = 0.25). Look for patterns like thirds ending in .333 or .667. Practice regularly to improve recall speed.",
    order: 4
  }
];

export default function FractionMatchClient({ relatedGames = defaultRelatedGames }: FractionMatchClientProps) {
  const [gamePhase, setGamePhase] = useState<GamePhase>('menu');
  const [difficulty, setDifficulty] = useState<Difficulty>('easy');
  const [gameMode, setGameMode] = useState<GameMode>('matching');

  const [cards, setCards] = useState<Card[]>([]);
  const [selectedCard, setSelectedCard] = useState<Card | null>(null);
  const [quizQuestion, setQuizQuestion] = useState<FractionData | null>(null);
  const [quizAnswer, setQuizAnswer] = useState('');

  const [matches, setMatches] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [maxStreak, setMaxStreak] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);

  const [feedback, setFeedback] = useState<'correct' | 'wrong' | null>(null);

  const [stats, setStats] = useState<Stats>({
    gamesPlayed: 0,
    totalMatches: 0,
    bestScore: 0,
    bestStreak: 0,
    bestAccuracy: 0
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { getH1, getSubHeading } = usePageSEO('fraction-match');

  const webAppSchema = generateWebAppSchema({
    name: 'Fraction Match Game',
    description: 'Match fractions with their decimal equivalents',
    url: typeof window !== 'undefined' ? window.location.href : ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('fractionMatchStats');
    if (saved) setStats(JSON.parse(saved));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const saveStats = (newStats: Stats) => {
    setStats(newStats);
    localStorage.setItem('fractionMatchStats', JSON.stringify(newStats));
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const generateCards = (): Card[] => {
    const selectedFractions = shuffleArray(fractionSets[difficulty]).slice(0, 6);
    const newCards: Card[] = [];

    selectedFractions.forEach((item, index) => {
      newCards.push({
        id: `f${index}`,
        type: 'fraction',
        value: item.fraction,
        pairId: index,
        matched: false
      });
      newCards.push({
        id: `d${index}`,
        type: 'decimal',
        value: item.display,
        pairId: index,
        matched: false
      });
    });

    return shuffleArray(newCards);
  };

  const generateQuizQuestion = () => {
    const questions = fractionSets[difficulty];
    const question = questions[Math.floor(Math.random() * questions.length)];
    setQuizQuestion(question);
    setQuizAnswer('');
  };

  const startGame = () => {
    setGamePhase('play');
    setMatches(0);
    setScore(0);
    setStreak(0);
    setMaxStreak(0);
    setMistakes(0);
    setSelectedCard(null);
    setFeedback(null);

    if (gameMode === 'timed') {
      setTimeLeft(120);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            endGame();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    if (gameMode === 'quiz') {
      generateQuizQuestion();
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setCards(generateCards());
    }
  };

  const handleCardClick = (card: Card) => {
    if (card.matched || feedback) return;

    if (!selectedCard) {
      setSelectedCard(card);
    } else if (selectedCard.id === card.id) {
      setSelectedCard(null);
    } else {
      checkMatch(card);
    }
  };

  const checkMatch = (secondCard: Card) => {
    if (!selectedCard) return;

    const isMatch = selectedCard.pairId === secondCard.pairId && selectedCard.type !== secondCard.type;

    if (isMatch) {
      setFeedback('correct');
      setMatches(m => m + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });

      const basePoints = 100;
      const streakBonus = streak * 25;
      const difficultyMultiplier = { easy: 1, medium: 1.5, hard: 2 }[difficulty];
      setScore(s => s + Math.floor((basePoints + streakBonus) * difficultyMultiplier));

      setCards(prev => prev.map(c =>
        c.id === selectedCard.id || c.id === secondCard.id
          ? { ...c, matched: true }
          : c
      ));

      setTimeout(() => {
        setFeedback(null);
        setSelectedCard(null);

        const allMatched = cards.every(c =>
          c.matched || c.id === selectedCard.id || c.id === secondCard.id
        );
        if (allMatched) {
          setTimeout(() => endGame(), 300);
        }
      }, 300);
    } else {
      setFeedback('wrong');
      setMistakes(m => m + 1);
      setStreak(0);

      setTimeout(() => {
        setFeedback(null);
        setSelectedCard(null);
      }, 500);
    }
  };

  const submitQuizAnswer = () => {
    if (!quizQuestion) return;

    const answer = parseFloat(quizAnswer);
    if (isNaN(answer)) return;

    const isCorrect = Math.abs(answer - quizQuestion.decimal) < 0.01;

    if (isCorrect) {
      setFeedback('correct');
      setMatches(m => m + 1);
      setStreak(s => {
        const newStreak = s + 1;
        if (newStreak > maxStreak) setMaxStreak(newStreak);
        return newStreak;
      });
      setScore(s => s + 150 + streak * 30);
    } else {
      setFeedback('wrong');
      setMistakes(m => m + 1);
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      if (matches + 1 >= 10) {
        endGame();
      } else {
        generateQuizQuestion();
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }, 1000);
  };

  const endGame = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setGamePhase('result');

    const accuracy = matches + mistakes > 0 ? Math.round((matches / (matches + mistakes)) * 100) : 0;

    const newStats = { ...stats };
    newStats.gamesPlayed++;
    newStats.totalMatches += matches;
    if (score > newStats.bestScore) newStats.bestScore = score;
    if (maxStreak > newStats.bestStreak) newStats.bestStreak = maxStreak;
    if (accuracy > newStats.bestAccuracy) newStats.bestAccuracy = accuracy;

    saveStats(newStats);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const accuracy = matches + mistakes > 0 ? Math.round((matches / (matches + mistakes)) * 100) : 0;

  const renderIcon = (iconName: string) => {
    switch (iconName) {
      case 'puzzle': return '🧩';
      case 'memory': return '🧠';
      case 'game': return '🎮';
      case 'speed': return '⚡';
      default: return '🎯';
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />

      <div className="max-w-[1200px] mx-auto px-4 py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-amber-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🎯</span>
            <span className="text-orange-700 font-semibold">Fraction Learning</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">{getH1('Fraction Match')}</h1>
          <p className="text-gray-600 max-w-xl mx-auto">
            Match fractions with their decimal equivalents! Learn fraction-decimal conversion.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Menu Phase */}
              {gamePhase === 'menu' && (
                <div className="space-y-6">
                  {/* Difficulty */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Select Difficulty</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {(['easy', 'medium', 'hard'] as Difficulty[]).map((diff) => (
                        <button
                          key={diff}
                          onClick={() => setDifficulty(diff)}
                          className={`p-4 rounded-xl border-2 transition-all ${
                            difficulty === diff
                              ? 'border-orange-500 bg-orange-50 shadow-md'
                              : 'border-gray-200 hover:border-orange-300'
                          }`}
                        >
                          <div className="text-2xl mb-1">
                            {diff === 'easy' ? '🌱' : diff === 'medium' ? '🌿' : '🌳'}
                          </div>
                          <div className="font-semibold text-gray-800 capitalize">{diff}</div>
                          <div className="text-xs text-gray-500">
                            {diff === 'easy' ? 'Halves, quarters' : diff === 'medium' ? 'Thirds, eighths' : 'Sevenths, ninths'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Game Mode */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-3">Game Mode</h3>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setGameMode('matching')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          gameMode === 'matching'
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">🃏</div>
                        <div className="font-bold text-gray-800">Match Pairs</div>
                        <div className="text-xs text-gray-500">Click matching cards</div>
                      </button>
                      <button
                        onClick={() => setGameMode('quiz')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          gameMode === 'quiz'
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">📝</div>
                        <div className="font-bold text-gray-800">Quiz Mode</div>
                        <div className="text-xs text-gray-500">Type the decimal</div>
                      </button>
                      <button
                        onClick={() => setGameMode('timed')}
                        className={`p-4 rounded-xl border-2 transition-all text-left ${
                          gameMode === 'timed'
                            ? 'border-orange-500 bg-orange-50 shadow-md'
                            : 'border-gray-200 hover:border-orange-300'
                        }`}
                      >
                        <div className="text-2xl mb-2">⏱️</div>
                        <div className="font-bold text-gray-800">Speed Match</div>
                        <div className="text-xs text-gray-500">2 minutes challenge</div>
                      </button>
                    </div>
                  </div>

                  {/* Start Button */}
                  <button
                    onClick={startGame}
                    className="w-full py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white text-xl font-bold rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all shadow-lg hover:shadow-xl"
                  >
                    Start Matching
                  </button>
                </div>
              )}

              {/* Play Phase */}
              {gamePhase === 'play' && (
                <div className="space-y-6">
                  {/* Game Header */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <div className="text-xl font-bold text-orange-600">{score} pts</div>
                      {gameMode === 'timed' && (
                        <div className={`font-bold ${timeLeft <= 30 ? 'text-red-500' : 'text-gray-600'}`}>
                          ⏱️ {formatTime(timeLeft)}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-4">
                      {streak > 0 && <span className="text-orange-600 font-bold">{streak} 🔥</span>}
                      <button onClick={() => setGamePhase('menu')} className="text-gray-500 hover:text-gray-700">
                        ✕ End
                      </button>
                    </div>
                  </div>

                  {/* Matching Game */}
                  {(gameMode === 'matching' || gameMode === 'timed') && (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {cards.map((card) => (
                        <button
                          key={card.id}
                          onClick={() => handleCardClick(card)}
                          disabled={card.matched}
                          className={`p-4 rounded-xl border-2 transition-all min-h-[80px] ${
                            card.matched
                              ? 'border-green-500 bg-green-50 opacity-60'
                              : selectedCard?.id === card.id
                              ? 'border-orange-500 bg-orange-50 scale-105'
                              : feedback === 'wrong' && selectedCard?.id === card.id
                              ? 'border-red-500 bg-red-50'
                              : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50'
                          }`}
                        >
                          <div className="text-xl font-bold text-gray-800">{card.value}</div>
                          <div className="text-xs text-gray-500 uppercase mt-1">{card.type}</div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Quiz Mode */}
                  {gameMode === 'quiz' && quizQuestion && (
                    <div className="text-center space-y-6">
                      <div className={`py-12 rounded-2xl transition-all ${
                        feedback === 'correct' ? 'bg-green-100' :
                        feedback === 'wrong' ? 'bg-red-100' :
                        'bg-gradient-to-br from-orange-50 to-amber-50'
                      }`}>
                        <div className="text-sm text-gray-600 mb-2">Convert to decimal:</div>
                        <div className="text-6xl font-bold text-gray-800">{quizQuestion.fraction}</div>
                        {feedback === 'wrong' && (
                          <div className="mt-4 text-red-600">Answer: {quizQuestion.display}</div>
                        )}
                      </div>

                      <div className="flex gap-3 max-w-md mx-auto">
                        <input
                          ref={inputRef}
                          type="number"
                          step="0.001"
                          value={quizAnswer}
                          onChange={(e) => setQuizAnswer(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && submitQuizAnswer()}
                          className="flex-1 text-3xl text-center p-4 border-2 border-gray-300 rounded-xl focus:border-orange-500 focus:outline-none"
                          placeholder="0.000"
                        />
                        <button
                          onClick={submitQuizAnswer}
                          className="px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600"
                        >
                          Check
                        </button>
                      </div>

                      <div className="text-gray-500">
                        Question {matches + 1} of 10
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Result Phase */}
              {gamePhase === 'result' && (
                <div className="text-center space-y-6">
                  <div className="text-6xl mb-4">
                    {accuracy >= 90 ? '🏆' : accuracy >= 70 ? '🎉' : '💪'}
                  </div>

                  <h2 className="text-3xl font-bold text-gray-800">
                    {accuracy >= 90 ? 'Outstanding!' : accuracy >= 70 ? 'Great Job!' : 'Keep Practicing!'}
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-orange-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-orange-600">{score}</div>
                      <div className="text-sm text-gray-600">Score</div>
                    </div>
                    <div className="bg-green-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-green-600">{matches}</div>
                      <div className="text-sm text-gray-600">Matches</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-amber-600">{maxStreak}</div>
                      <div className="text-sm text-gray-600">Best Streak</div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-4">
                      <div className="text-3xl font-bold text-blue-600">{accuracy}%</div>
                      <div className="text-sm text-gray-600">Accuracy</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <button
                      onClick={startGame}
                      className="px-8 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold rounded-xl hover:from-orange-600 hover:to-amber-600"
                    >
                      Play Again
                    </button>
                    <button
                      onClick={() => setGamePhase('menu')}
                      className="px-8 py-3 bg-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-300"
                    >
                      Change Settings
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Reference Table */}
            <div className="mt-6 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Common Fraction-Decimal Reference</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {[
                  { f: '1/2', d: '0.5' }, { f: '1/4', d: '0.25' }, { f: '3/4', d: '0.75' },
                  { f: '1/3', d: '0.333' }, { f: '2/3', d: '0.667' }, { f: '1/5', d: '0.2' },
                  { f: '1/8', d: '0.125' }, { f: '3/8', d: '0.375' }, { f: '5/8', d: '0.625' },
                  { f: '7/8', d: '0.875' }, { f: '1/10', d: '0.1' }, { f: '1/6', d: '0.167' }
                ].map((item, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 text-center shadow-sm">
                    <div className="font-bold text-orange-600">{item.f}</div>
                    <div className="text-sm text-gray-600">{item.d}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* How to Play */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">How to Play</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                <div className="flex gap-3">
                  <span className="text-2xl">1️⃣</span>
                  <div>
                    <strong>Select Mode</strong>
                    <p className="text-sm text-gray-600">Match pairs, quiz, or speed challenge</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">2️⃣</span>
                  <div>
                    <strong>Find Matches</strong>
                    <p className="text-sm text-gray-600">Click a fraction, then its decimal equivalent</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">3️⃣</span>
                  <div>
                    <strong>Build Streaks</strong>
                    <p className="text-sm text-gray-600">Consecutive correct matches = bonus points!</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-2xl">4️⃣</span>
                  <div>
                    <strong>Learn Patterns</strong>
                    <p className="text-sm text-gray-600">Memorize common conversions over time</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile MREC2 - Before FAQs */}


            <GameAppMobileMrec2 />



            {/* FAQs */}
            <div className="mt-6">
              <FirebaseFAQs pageId="fraction-match" fallbackFaqs={fallbackFaqs} />
            </div>
          </div>
{/* Sidebar */}
          <div className="lg:w-[320px] space-y-6">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="mx-auto" />

            {/* Stats Card */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>📊</span> Your Stats
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Games Played</span>
                  <span className="font-bold text-gray-800">{stats.gamesPlayed}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Score</span>
                  <span className="font-bold text-orange-600">{stats.bestScore}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600">Best Streak</span>
                  <span className="font-bold text-amber-600">{stats.bestStreak}</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-600">Best Accuracy</span>
                  <span className="font-bold text-green-600">{stats.bestAccuracy}%</span>
                </div>
              </div>
            </div>
{/* Related Games */}
            <div className="bg-white rounded-2xl shadow-lg p-5">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span>🎮</span> Related Games
              </h3>
              <div className="space-y-3">
                {relatedGames.map((game, index) => (
                  <Link
                    key={index}
                    href={game.href}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group"
                  >
                    <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {renderIcon(game.icon)}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-gray-800 group-hover:text-orange-600 transition-colors">
                        {game.title}
                      </div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                    <span className="text-gray-400 group-hover:text-orange-500">→</span>
                  </Link>
                ))}
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
          </div>
        </div>
      </div>
    </>
  );
}
