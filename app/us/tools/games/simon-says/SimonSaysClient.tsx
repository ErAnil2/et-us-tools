'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
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
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do I play Simon Says?',
    answer: 'Watch as Simon lights up colored buttons in a sequence. After the sequence finishes, click the buttons in the same order. Each round adds one more step to remember.',
    order: 1
  },
  {
    id: '2',
    question: 'What are the different game modes?',
    answer: 'Classic mode gives you one life - any mistake ends the game. Challenge mode gives you 3 lives and ends at round 20. Speed mode adds time pressure to each round.',
    order: 2
  },
  {
    id: '3',
    question: 'How does difficulty affect the game?',
    answer: 'Easy has 4 colors with slow speed. Medium has 4 colors at normal speed. Hard adds 2 more colors (6 total) with faster speed. Expert has 8 colors at very fast speed.',
    order: 3
  },
  {
    id: '4',
    question: 'How is the score calculated?',
    answer: 'Each round gives base points multiplied by a difficulty bonus. Speed mode gives extra points for faster responses. Higher difficulties have higher multipliers.',
    order: 4
  },
  {
    id: '5',
    question: 'Does Simon Says help improve memory?',
    answer: 'Yes! Simon Says is excellent for training working memory, sequence recall, and auditory-visual memory. Regular play can improve concentration and memory capacity.',
    order: 5
  },
  {
    id: '6',
    question: 'Why are there sounds with each color?',
    answer: 'Each color plays a unique tone to help with memory. Using multiple senses (visual + auditory) improves recall. You can disable sounds in the settings if preferred.',
    order: 6
  }
];

type Difficulty = 'easy' | 'medium' | 'hard' | 'expert';
type GameMode = 'classic' | 'challenge' | 'speed';

interface SimonSaysClientProps {
  relatedGames: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

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

export default function SimonSaysClient({ relatedGames = defaultRelatedGames }: SimonSaysClientProps) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('simon-says');

  const webAppSchema = generateWebAppSchema(
    'Simon Says Game - Free Online Memory Training',
    'Play Simon Says online for free. Follow color sequences to test your memory. Multiple difficulty levels and game modes available.',
    'https://economictimes.indiatimes.com/us/tools/games/simon-says',
    'Game'
  );

  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [gameMode, setGameMode] = useState<GameMode>('classic');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sequence, setSequence] = useState<string[]>([]);
  const [playerSequence, setPlayerSequence] = useState<string[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [isShowingSequence, setIsShowingSequence] = useState(false);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  const [lives, setLives] = useState(3);
  const [timeLeft, setTimeLeft] = useState(0);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [maxRound, setMaxRound] = useState(0);

  const [gamePhase, setGamePhase] = useState<'menu' | 'play' | 'result'>('menu');
  const [gameStatus, setGameStatus] = useState('Watch the sequence...');
  const [progressWidth, setProgressWidth] = useState(0);
  const [progressText, setProgressText] = useState('Step 1 of 3');
  const [showProgress, setShowProgress] = useState(false);

  const [resultEmoji, setResultEmoji] = useState('🎯');
  const [finalRound, setFinalRound] = useState(1);
  const [finalScore, setFinalScore] = useState(0);
  const [achievements, setAchievements] = useState<Array<{ text: string; icon: string }>>([]);
  const [feedbackContent, setFeedbackContent] = useState('');

  const [activeColors, setActiveColors] = useState<string[]>(['red', 'blue', 'green', 'yellow']);
  const [flashingButton, setFlashingButton] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const colors: Record<number, string[]> = {
    4: ['red', 'blue', 'green', 'yellow'],
    6: ['red', 'blue', 'green', 'yellow', 'purple', 'orange'],
    8: ['red', 'blue', 'green', 'yellow', 'purple', 'orange', 'pink', 'teal']
  };

  const colorMap: Record<string, string> = {
    red: '#dc2626',
    blue: '#2563eb',
    green: '#16a34a',
    yellow: '#ca8a04',
    purple: '#9333ea',
    orange: '#ea580c',
    pink: '#ec4899',
    teal: '#0d9488'
  };

  const toneFrequencies: Record<string, number> = {
    red: 220, blue: 277, green: 330, yellow: 415,
    purple: 523, orange: 659, pink: 784, teal: 880,
    wrong: 150, success: 1000
  };

  // Load stats from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('simonSaysStats');
    if (saved) {
      const stats = JSON.parse(saved);
      setBestScore(stats.bestScore || 0);
      setGamesPlayed(stats.gamesPlayed || 0);
      setMaxRound(stats.maxRound || 0);
    }
  }, []);

  const saveStats = useCallback((newScore: number, newRound: number) => {
    const newGamesPlayed = gamesPlayed + 1;
    const newBestScore = Math.max(bestScore, newScore);
    const newMaxRound = Math.max(maxRound, newRound);

    setBestScore(newBestScore);
    setGamesPlayed(newGamesPlayed);
    setMaxRound(newMaxRound);

    localStorage.setItem('simonSaysStats', JSON.stringify({
      bestScore: newBestScore,
      gamesPlayed: newGamesPlayed,
      maxRound: newMaxRound
    }));
  }, [bestScore, gamesPlayed, maxRound]);

  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    }
    return audioContextRef.current;
  }, []);

  const playTone = useCallback((frequency: number, duration: number) => {
    if (!soundEnabled) return;
    try {
      const audioContext = initAudioContext();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
      oscillator.type = 'sine';

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    } catch (e) {
      console.log('Audio not available');
    }
  }, [soundEnabled, initAudioContext]);

  const getColorCount = useCallback(() => {
    const counts: Record<Difficulty, number> = { easy: 4, medium: 4, hard: 6, expert: 8 };
    return counts[difficulty];
  }, [difficulty]);

  const getSequenceSpeed = useCallback(() => {
    const speeds: Record<Difficulty, number> = { easy: 1000, medium: 800, hard: 600, expert: 400 };
    return speeds[difficulty];
  }, [difficulty]);

  const lightenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent * 100);
    const R = (num >> 16) + amt;
    const B = (num >> 8 & 0x00FF) + amt;
    const G = (num & 0x0000FF) + amt;
    return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (B < 255 ? B < 1 ? 0 : B : 255) * 0x100 +
      (G < 255 ? G < 1 ? 0 : G : 255)).toString(16).slice(1);
  };

  const flashColor = useCallback(async (color: string, duration: number) => {
    playTone(toneFrequencies[color], 0.3);
    setFlashingButton(color);
    await new Promise(resolve => setTimeout(resolve, duration * 0.6));
    setFlashingButton(null);
  }, [playTone, toneFrequencies]);

  const showSequence = useCallback(async (seq: string[]) => {
    setIsShowingSequence(true);
    setIsPlayerTurn(false);
    const speed = getSequenceSpeed();

    for (let i = 0; i < seq.length; i++) {
      await flashColor(seq[i], speed);
      await new Promise(resolve => setTimeout(resolve, speed / 2));
    }

    setIsShowingSequence(false);
    setIsPlayerTurn(true);
    setGameStatus('Your turn - repeat the sequence!');

    if (gameMode === 'speed') {
      startSpeedTimer(currentRound);
    }
  }, [getSequenceSpeed, flashColor, gameMode, currentRound]);

  const startSpeedTimer = useCallback((round: number) => {
    let time = Math.max(5, 15 - round);
    setTimeLeft(time);

    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    timerIntervalRef.current = setInterval(() => {
      time--;
      setTimeLeft(time);
      if (time <= 0) {
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        handleWrongInput();
      }
    }, 1000);
  }, []);

  const startRound = useCallback((currentSeq: string[], round: number) => {
    const colorCount = getColorCount();
    const availableColors = colors[colorCount];
    const newColor = availableColors[Math.floor(Math.random() * availableColors.length)];
    const newSequence = [...currentSeq, newColor];

    setSequence(newSequence);
    setPlayerSequence([]);
    setCurrentRound(round);
    setGameStatus('Watch the sequence...');

    setTimeout(() => showSequence(newSequence), 1000);
  }, [getColorCount, colors, showSequence]);

  const handleCorrectSequence = useCallback(() => {
    setIsPlayerTurn(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const roundBonus = currentRound * 100;
    const speedBonus = gameMode === 'speed' ? Math.max(0, timeLeft * 10) : 0;
    const difficultyMultiplier: Record<Difficulty, number> = { easy: 1, medium: 1.5, hard: 2, expert: 2.5 };

    const newScore = score + Math.round((roundBonus + speedBonus) * difficultyMultiplier[difficulty]);
    setScore(newScore);

    setGameStatus('Correct! Get ready for the next round...');
    setShowProgress(false);

    playTone(toneFrequencies.success, 0.2);

    if (gameMode === 'challenge' && currentRound >= 20) {
      setTimeout(() => endGame(true, newScore, currentRound), 1500);
      return;
    }

    setTimeout(() => startRound(sequence, currentRound + 1), 1500);
  }, [currentRound, gameMode, timeLeft, score, difficulty, sequence, playTone, toneFrequencies, startRound]);

  const handleWrongInput = useCallback(() => {
    setIsPlayerTurn(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    playTone(toneFrequencies.wrong, 0.5);
    setGameStatus('Wrong! Try again...');

    if (gameMode === 'classic') {
      setTimeout(() => endGame(false, score, currentRound), 1500);
    } else {
      const newLives = lives - 1;
      setLives(newLives);
      if (newLives <= 0) {
        setTimeout(() => endGame(false, score, currentRound), 1500);
      } else {
        setTimeout(() => retryRound(), 1500);
      }
    }
  }, [gameMode, lives, score, currentRound, playTone, toneFrequencies]);

  const retryRound = useCallback(() => {
    setPlayerSequence([]);
    setShowProgress(false);
    setTimeout(() => showSequence(sequence), 500);
  }, [sequence, showSequence]);

  const handlePlayerInput = useCallback((color: string) => {
    if (!isPlayerTurn || isShowingSequence) return;

    const newPlayerSequence = [...playerSequence, color];
    setPlayerSequence(newPlayerSequence);

    flashColor(color, 200);

    const currentIndex = newPlayerSequence.length - 1;
    if (newPlayerSequence[currentIndex] !== sequence[currentIndex]) {
      handleWrongInput();
      return;
    }

    const progress = (newPlayerSequence.length / sequence.length) * 100;
    setProgressWidth(progress);
    setProgressText(`Step ${newPlayerSequence.length} of ${sequence.length}`);
    setShowProgress(true);

    if (newPlayerSequence.length === sequence.length) {
      handleCorrectSequence();
    }
  }, [isPlayerTurn, isShowingSequence, playerSequence, sequence, flashColor, handleWrongInput, handleCorrectSequence]);

  const endGame = useCallback((won: boolean, finalScoreVal: number, finalRoundVal: number) => {
    setGameActive(false);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    saveStats(finalScoreVal, finalRoundVal);

    setFinalRound(won ? finalRoundVal : Math.max(1, finalRoundVal - 1));
    setFinalScore(finalScoreVal);

    const newAchievements: Array<{ text: string; icon: string }> = [];
    if (finalRoundVal >= 5) newAchievements.push({ text: 'Memory Rookie', icon: '🥉' });
    if (finalRoundVal >= 10) newAchievements.push({ text: 'Sequence Master', icon: '🥈' });
    if (finalRoundVal >= 15) newAchievements.push({ text: 'Simon Expert', icon: '🥇' });
    if (finalRoundVal >= 20) newAchievements.push({ text: 'Memory Legend', icon: '🏆' });
    if (finalScoreVal > bestScore) newAchievements.push({ text: 'New Record!', icon: '⭐' });
    setAchievements(newAchievements);

    let feedback = '';
    if (finalRoundVal >= 20) feedback = 'Incredible! You have an amazing memory and concentration skills.';
    else if (finalRoundVal >= 15) feedback = 'Excellent performance! Your memory skills are very strong.';
    else if (finalRoundVal >= 10) feedback = 'Great job! You have good memory and focus abilities.';
    else if (finalRoundVal >= 5) feedback = 'Not bad! Keep practicing to improve your memory skills.';
    else feedback = 'Good start! Memory games take practice - keep trying!';
    setFeedbackContent(feedback);

    let emoji = '🎯';
    if (finalRoundVal >= 20) emoji = '🏆';
    else if (finalRoundVal >= 15) emoji = '🌟';
    else if (finalRoundVal >= 10) emoji = '🎉';
    else if (finalRoundVal >= 5) emoji = '👍';
    setResultEmoji(emoji);

    setGamePhase('result');
  }, [bestScore, saveStats]);

  const startGame = () => {
    const colorCount = getColorCount();
    setActiveColors(colors[colorCount]);

    setSequence([]);
    setPlayerSequence([]);
    setCurrentRound(1);
    setScore(0);
    setIsShowingSequence(false);
    setIsPlayerTurn(false);
    setGameActive(true);
    setLives(gameMode === 'classic' ? 1 : 3);
    setShowProgress(false);

    setGamePhase('play');

    setTimeout(() => startRound([], 1), 500);
  };

  const resetToMenu = () => {
    setGameActive(false);
    setGamePhase('menu');
  };

  const getGridClass = () => {
    const colorCount = activeColors.length;
    if (colorCount === 4) return 'grid grid-cols-2 gap-3';
    if (colorCount === 6) return 'grid grid-cols-3 gap-3';
    return 'grid grid-cols-4 gap-2';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50">
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
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-green-100 px-4 py-2 rounded-full mb-3">
            <span className="text-2xl">🔄</span>
            <span className="text-blue-600 font-semibold">Simon Says</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent mb-2">
            {getH1('Simon Says Memory Game')}
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Watch the sequence of flashing colors and repeat it back. How far can you go?')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Game Area */}
          <div className="flex-1">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              {/* Game Setup */}
              {gamePhase === 'menu' && (
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-800 mb-6">Choose Your Settings</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-lg mx-auto mb-8">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                      <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="easy">Easy (4 colors, slow)</option>
                        <option value="medium">Medium (4 colors)</option>
                        <option value="hard">Hard (6 colors)</option>
                        <option value="expert">Expert (8 colors)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Game Mode</label>
                      <select
                        value={gameMode}
                        onChange={(e) => setGameMode(e.target.value as GameMode)}
                        className="w-full p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="classic">Classic (1 life)</option>
                        <option value="challenge">Challenge (3 lives)</option>
                        <option value="speed">Speed (time limit)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-8">
                    <label className="flex items-center justify-center gap-2">
                      <input
                        type="checkbox"
                        checked={soundEnabled}
                        onChange={(e) => setSoundEnabled(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-gray-700">Enable Sound Effects</span>
                    </label>
                  </div>

                  <button
                    onClick={startGame}
                    className="px-10 py-4 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-bold text-lg hover:from-blue-600 hover:to-green-600 transition-all shadow-lg"
                  >
                    Start Game
                  </button>
                </div>
              )}

              {/* Game Play */}
              {gamePhase === 'play' && (
                <div>
                  {/* Stats Bar */}
                  <div className="grid grid-cols-4 gap-3 mb-6">
                    <div className="bg-blue-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-blue-600">Round</div>
                      <div className="text-xl font-bold text-blue-700">{currentRound}</div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-green-600">Score</div>
                      <div className="text-xl font-bold text-green-700">{score}</div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-purple-600">Best</div>
                      <div className="text-xl font-bold text-purple-700">{bestScore}</div>
                    </div>
                    <div className="bg-orange-50 rounded-lg p-3 text-center">
                      <div className="text-xs text-orange-600">{gameMode === 'speed' ? 'Time' : 'Lives'}</div>
                      <div className="text-xl font-bold text-orange-700">{gameMode === 'speed' ? timeLeft : '❤️'.repeat(lives)}</div>
                    </div>
                  </div>

                  {/* Game Status */}
                  <div className="text-center mb-4">
                    <div className="text-lg font-semibold text-gray-800 mb-2">{gameStatus}</div>
                    {showProgress && (
                      <div className="max-w-md mx-auto">
                        <div className="bg-gray-200 rounded-full h-2 mb-1">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${progressWidth}%` }}
                          />
                        </div>
                        <div className="text-sm text-gray-600">{progressText}</div>
                      </div>
                    )}
                  </div>

                  {/* Simon Board */}
                  <div className="flex justify-center mb-6">
                    <div className={getGridClass()}>
                      {activeColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => handlePlayerInput(color)}
                          disabled={!isPlayerTurn || isShowingSequence}
                          className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl shadow-lg transform transition-all duration-150 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60"
                          style={{
                            backgroundColor: flashingButton === color
                              ? lightenColor(colorMap[color], 0.4)
                              : colorMap[color],
                            transform: flashingButton === color ? 'scale(1.05)' : 'scale(1)'
                          }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Controls */}
                  <div className="text-center">
                    <button
                      onClick={resetToMenu}
                      className="px-6 py-2 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600"
                    >
                      Quit Game
                    </button>
                  </div>
                </div>
              )}

              {/* Results */}
              {gamePhase === 'result' && (
                <div className="text-center">
                  <div className="text-6xl mb-4">{resultEmoji}</div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Game Over!</h2>

                  <div className="grid grid-cols-2 gap-4 max-w-md mx-auto mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Final Round</div>
                      <div className="text-3xl font-bold text-blue-600">{finalRound}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-purple-50 rounded-xl p-4">
                      <div className="text-sm text-gray-600">Final Score</div>
                      <div className="text-3xl font-bold text-green-600">{finalScore}</div>
                    </div>
                  </div>

                  {achievements.length > 0 && (
                    <div className="mb-6">
                      {achievements.map((achievement, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium mr-2 mb-2"
                        >
                          {achievement.icon} {achievement.text}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                    <p className="text-blue-700">{feedbackContent}</p>
                  </div>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={resetToMenu}
                      className="px-8 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-xl font-bold hover:from-blue-600 hover:to-green-600"
                    >
                      Play Again
                    </button>
                    <Link
                      href="/us/tools/games"
                      className="px-8 py-3 bg-gray-200 text-gray-700 rounded-xl font-semibold hover:bg-gray-300"
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
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">1</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Watch the Sequence</h4>
                    <p className="text-sm text-gray-600">Colors will flash in a specific order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">2</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Repeat It Back</h4>
                    <p className="text-sm text-gray-600">Click colors in the same order</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">3</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Each Round Adds One</h4>
                    <p className="text-sm text-gray-600">Sequences get longer each round</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold flex-shrink-0">4</div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Beat Your Best</h4>
                    <p className="text-sm text-gray-600">Try to reach higher rounds!</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pro Tips */}
            <div className="mt-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Pro Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 mb-1">Use sounds</h4>
                  <p className="text-sm text-gray-600">Each color has a unique tone to help memory</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-1">Say colors aloud</h4>
                  <p className="text-sm text-gray-600">Verbalize the sequence as you watch</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-blue-700 mb-1">Group in chunks</h4>
                  <p className="text-sm text-gray-600">Break long sequences into smaller groups</p>
                </div>
                <div className="bg-white/80 rounded-xl p-4">
                  <h4 className="font-semibold text-green-700 mb-1">Stay relaxed</h4>
                  <p className="text-sm text-gray-600">Tension reduces memory performance</p>
                </div>
              </div>
            </div>

            {/* SEO Content */}
            <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Simon Says: The Memory Challenge</h2>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Simon is an electronic game invented by Ralph H. Baer and Howard J. Morrison in 1978. The game became
                a cultural phenomenon in the 1980s and remains popular today in both physical and digital versions.
                Named after the classic children&apos;s game &quot;Simon Says,&quot; it challenges players to repeat increasingly
                complex sequences of lights and sounds, testing memory and concentration in an engaging way.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                  <h3 className="font-semibold text-blue-800 mb-2">🧠 Working Memory</h3>
                  <p className="text-sm text-gray-600">Simon directly exercises working memory - your ability to hold and manipulate information short-term.</p>
                </div>
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                  <h3 className="font-semibold text-green-800 mb-2">👁️ Visual-Auditory Learning</h3>
                  <p className="text-sm text-gray-600">The combination of colors and sounds engages multiple senses for better memory encoding.</p>
                </div>
                <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
                  <h3 className="font-semibold text-yellow-800 mb-2">🎯 Focus Training</h3>
                  <p className="text-sm text-gray-600">Each round requires intense concentration, building sustained attention skills.</p>
                </div>
                <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                  <h3 className="font-semibold text-red-800 mb-2">📈 Progressive Difficulty</h3>
                  <p className="text-sm text-gray-600">Starting easy and getting harder, Simon adapts to challenge players at their level.</p>
                </div>
              </div>

              <div className="bg-gradient-to-r from-blue-100 to-green-100 rounded-xl p-5 mb-6">
                <h3 className="font-bold text-gray-800 mb-3">Scientific Research</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Studies have shown that the average person can remember about 7 items (plus or minus 2) in their
                  short-term memory. Simon challenges players to exceed this limit by using techniques like chunking
                  and pattern recognition. Regular play can help expand working memory capacity, which is linked to
                  better performance in reading comprehension, mathematics, and problem-solving.
                </p>
              </div>

              <div className="bg-gray-50 rounded-xl p-5">
                <h3 className="font-bold text-gray-800 mb-3">Memory Techniques</h3>
                <ul className="space-y-2 text-gray-600 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500">•</span>
                    <span>Chunking - group sequences into smaller, memorable chunks</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">•</span>
                    <span>Visualization - associate colors with spatial positions or patterns</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-yellow-500">•</span>
                    <span>Rhythm - create a mental rhythm to the sequence timing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500">•</span>
                    <span>Active rehearsal - mentally repeat the sequence as it plays</span>
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
                    <span className="font-bold text-blue-600">{bestScore}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Max Round</span>
                    <span className="font-bold text-green-600">{maxRound}</span>
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
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {getGameIcon(game.icon)}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{game.title}</div>
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
