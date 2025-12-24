'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you play Rock Paper Scissors?',
    answer: 'Choose rock, paper, or scissors by clicking the buttons or pressing R, P, or S keys. Rock beats scissors, scissors beats paper, and paper beats rock. Play against the computer!',
    order: 1
  },
  {
    id: '2',
    question: 'What game modes are available?',
    answer: 'Three modes: Quick Play for instant rounds, Best of 5 where first to 3 wins, and Tournament mode with 10 rounds to determine the ultimate winner.',
    order: 2
  },
  {
    id: '3',
    question: 'What is the winning strategy for Rock Paper Scissors?',
    answer: 'While the game appears random, studies show humans tend to repeat winning moves and switch after losses. Mix up your choices unpredictably to improve your odds!',
    order: 3
  },
  {
    id: '4',
    question: 'Can I use keyboard shortcuts?',
    answer: 'Yes! Press R for Rock, P for Paper, and S for Scissors. This makes for faster gameplay, especially in quick play mode.',
    order: 4
  },
  {
    id: '5',
    question: 'How is the win rate calculated?',
    answer: 'Your win rate shows the percentage of games you won out of all games played (wins divided by total games, excluding draws in the percentage calculation).',
    order: 5
  },
  {
    id: '6',
    question: 'Is the computer choice truly random?',
    answer: 'Yes, the computer uses a random number generator to select its move, giving each choice (rock, paper, scissors) an equal 33.3% probability.',
    order: 6
  }
];

interface Choice {
  emoji: string;
  beats: string;
}

interface Choices {
  rock: Choice;
  paper: Choice;
  scissors: Choice;
}

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface RockPaperScissorsClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

export default function RockPaperScissorsClient({ relatedGames = defaultRelatedGames }: RockPaperScissorsClientProps) {
  const [gameMode, setGameMode] = useState<'quick' | 'bestOfFive' | 'tournament'>('quick');
  const [maxRounds, setMaxRounds] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [draws, setDraws] = useState(0);
  const [currentRound, setCurrentRound] = useState(1);
  const [gameActive, setGameActive] = useState(false);
  const [roundInProgress, setRoundInProgress] = useState(false);
  const [playerChoice, setPlayerChoice] = useState('❓');
  const [computerChoice, setComputerChoice] = useState('❓');
  const [roundResult, setRoundResult] = useState({ icon: '🤝', text: 'Ready!', explanation: 'Pick your move', className: '' });
  const [showResult, setShowResult] = useState(false);
  const [showFinalResult, setShowFinalResult] = useState(false);
  const [finalResultData, setFinalResultData] = useState({ icon: '', title: '', message: '', titleClass: '' });
  const [showGameSetup, setShowGameSetup] = useState(true);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('rock-paper-scissors');

  const webAppSchema = generateWebAppSchema({
    name: 'Rock Paper Scissors Game - Free Online Classic Game',
    description: 'Play Rock Paper Scissors online for free. Challenge the computer in quick play, best of 5, or tournament mode. Classic hand game with keyboard support!',
    url: 'https://economictimes.indiatimes.com/us/tools/games/rock-paper-scissors',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  const choices: Choices = {
    rock: { emoji: '🪨', beats: 'scissors' },
    paper: { emoji: '📄', beats: 'rock' },
    scissors: { emoji: '✂️', beats: 'paper' }
  };

  const selectGameMode = (mode: 'quick' | 'bestOfFive' | 'tournament', rounds: number) => {
    setGameMode(mode);
    setMaxRounds(rounds);
    setShowGameSetup(false);
    resetGameState();
  };

  const resetGameState = () => {
    setPlayerWins(0);
    setComputerWins(0);
    setDraws(0);
    setCurrentRound(1);
    setGameActive(true);
    setRoundInProgress(false);
    setPlayerChoice('❓');
    setComputerChoice('❓');
    setShowResult(false);
    setShowFinalResult(false);
  };

  const makeChoice = (choice: keyof Choices) => {
    if (roundInProgress || !gameActive) return;

    setRoundInProgress(true);

    setTimeout(() => {
      setPlayerChoice(choices[choice].emoji);
    }, 100);

    let thinkCount = 0;
    const thinkInterval = setInterval(() => {
      const randomChoice = getComputerChoice();
      setComputerChoice(choices[randomChoice].emoji);
      thinkCount++;

      if (thinkCount >= 5) {
        clearInterval(thinkInterval);
        const finalComputerChoice = getComputerChoice();
        setComputerChoice(choices[finalComputerChoice].emoji);
        setTimeout(() => {
          playRound(choice, finalComputerChoice);
        }, 150);
      }
    }, 200);
  };

  const getComputerChoice = (): keyof Choices => {
    const choiceKeys = Object.keys(choices) as Array<keyof Choices>;
    return choiceKeys[Math.floor(Math.random() * choiceKeys.length)];
  };

  const playRound = (playerChoiceKey: keyof Choices, compChoice: keyof Choices) => {
    const result = determineWinner(playerChoiceKey, compChoice);

    if (result === 'player') {
      setPlayerWins(prev => prev + 1);
    } else if (result === 'computer') {
      setComputerWins(prev => prev + 1);
    } else {
      setDraws(prev => prev + 1);
    }

    showRoundResultFn(result, playerChoiceKey, compChoice);

    setTimeout(() => {
      if (isGameComplete(playerWins + (result === 'player' ? 1 : 0), computerWins + (result === 'computer' ? 1 : 0), currentRound)) {
        setTimeout(() => {
          showFinalResultModal(playerWins + (result === 'player' ? 1 : 0), computerWins + (result === 'computer' ? 1 : 0));
        }, 2500);
      } else {
        if (gameMode === 'quick') {
          setTimeout(() => {
            startNewRound();
          }, 2500);
        } else {
          setRoundInProgress(false);
        }
      }
    }, 100);
  };

  const determineWinner = (playerChoiceKey: keyof Choices, compChoice: keyof Choices): 'player' | 'computer' | 'draw' => {
    if (playerChoiceKey === compChoice) return 'draw';
    if (choices[playerChoiceKey].beats === compChoice) return 'player';
    return 'computer';
  };

  const showRoundResultFn = (result: 'player' | 'computer' | 'draw', playerChoiceKey: keyof Choices, compChoice: keyof Choices) => {
    let icon, text, explanation, className;

    if (result === 'player') {
      icon = '🎉';
      text = 'You Win!';
      className = 'text-lg font-bold text-green-600 animate-bounce-subtle';
      explanation = `${playerChoiceKey.charAt(0).toUpperCase() + playerChoiceKey.slice(1)} beats ${compChoice}`;
    } else if (result === 'computer') {
      icon = '😞';
      text = 'Computer Wins!';
      className = 'text-lg font-bold text-red-600';
      explanation = `${compChoice.charAt(0).toUpperCase() + compChoice.slice(1)} beats ${playerChoiceKey}`;
    } else {
      icon = '🤝';
      text = 'Draw!';
      className = 'text-lg font-bold text-gray-600';
      explanation = `Both chose ${playerChoiceKey}`;
    }

    setRoundResult({ icon, text, explanation, className });
    setShowResult(true);
  };

  const isGameComplete = (pWins: number, cWins: number, round: number): boolean => {
    if (gameMode === 'quick') return false;
    if (gameMode === 'bestOfFive') return pWins >= 3 || cWins >= 3;
    if (gameMode === 'tournament') return round >= maxRounds;
    return false;
  };

  const showFinalResultModal = (pWins: number, cWins: number) => {
    setGameActive(false);

    let winner: 'player' | 'computer' | 'draw';
    if (gameMode === 'bestOfFive') {
      winner = pWins >= 3 ? 'player' : 'computer';
    } else {
      winner = pWins > cWins ? 'player' : pWins < cWins ? 'computer' : 'draw';
    }

    let icon, title, message, titleClass;

    if (winner === 'player') {
      icon = '🏆';
      title = 'You Won!';
      titleClass = 'text-3xl font-bold mb-4 text-green-600';
      message = `Congratulations! You beat the computer ${pWins}-${cWins}!`;
    } else if (winner === 'computer') {
      icon = '💻';
      title = 'Computer Won!';
      titleClass = 'text-3xl font-bold mb-4 text-red-600';
      message = `Better luck next time! Computer won ${cWins}-${pWins}.`;
    } else {
      icon = '🤝';
      title = "It's a Tie!";
      titleClass = 'text-3xl font-bold mb-4 text-gray-600';
      message = `Great match! You tied ${pWins}-${cWins}.`;
    }

    setFinalResultData({ icon, title, message, titleClass });
    setShowFinalResult(true);
  };

  const startNewRound = () => {
    setCurrentRound(prev => prev + 1);
    setRoundInProgress(false);
    setShowResult(false);

    setTimeout(() => {
      setPlayerChoice('❓');
      setComputerChoice('❓');
    }, 300);
  };

  const resetGame = () => {
    setShowFinalResult(false);
    setShowGameSetup(true);
    setGameActive(false);
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameActive || roundInProgress) return;

    const key = e.key.toLowerCase();
    if (key === 'r') makeChoice('rock');
    else if (key === 'p') makeChoice('paper');
    else if (key === 's') makeChoice('scissors');
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameActive, roundInProgress]);

  const winRate = playerWins + computerWins + draws > 0
    ? Math.round((playerWins / (playerWins + computerWins + draws)) * 100)
    : 0;

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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-yellow-100 to-red-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">✂️</span>
            <span className="text-yellow-600 font-semibold text-sm sm:text-base">Rock Paper Scissors</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-yellow-600 to-red-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
            {getH1('Rock Paper Scissors')}
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            {getSubHeading('The classic hand game! Use R, P, S keys or click to play.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          {/* Game Container */}
          <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {/* Game Mode Selection */}
            {showGameSetup && (
              <div id="gameSetup" className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Choose Your Game Mode</h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <button onClick={() => selectGameMode('quick', 1)} className="game-mode-btn bg-green-50 border-2 border-green-200 rounded-lg p-4 hover:border-green-400 transition-all hover:shadow-lg">
                    <div className="text-3xl mb-2">⚡</div>
                    <h3 className="text-lg font-bold text-green-800 mb-1">Quick Play</h3>
                    <p className="text-sm text-green-700">Instant rounds</p>
                  </button>

                  <button onClick={() => selectGameMode('bestOfFive', 5)} className="game-mode-btn bg-blue-50 border-2 border-blue-200 rounded-lg p-4 hover:border-blue-400 transition-all hover:shadow-lg">
                    <div className="text-3xl mb-2">🏆</div>
                    <h3 className="text-lg font-bold text-blue-800 mb-1">Best of 5</h3>
                    <p className="text-sm text-blue-700">First to 3 wins</p>
                  </button>

                  <button onClick={() => selectGameMode('tournament', 10)} className="game-mode-btn bg-purple-50 border-2 border-purple-200 rounded-lg p-4 hover:border-purple-400 transition-all hover:shadow-lg">
                    <div className="text-3xl mb-2">🎯</div>
                    <h3 className="text-lg font-bold text-purple-800 mb-1">Tournament</h3>
                    <p className="text-sm text-purple-700">10 rounds match</p>
                  </button>
                </div>
              </div>
            )}

            {/* Game Play */}
            {!showGameSetup && (
              <div id="gamePlay">
                {/* Compact Stats Bar */}
                <div className="flex justify-between items-center mb-3 p-2 sm:p-3 bg-gradient-to-r from-green-50 via-gray-50 to-red-50 rounded-lg">
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-gray-600 mb-1">You</div>
                    <div className="text-xl sm:text-2xl font-bold text-green-600">{playerWins}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Draws</div>
                    <div className="text-lg sm:text-xl font-bold text-gray-600">{draws}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Round</div>
                    <div className="text-lg sm:text-xl font-bold text-blue-600">{currentRound}</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-gray-600 mb-1">Win%</div>
                    <div className="text-lg sm:text-xl font-bold text-yellow-600">{winRate}%</div>
                  </div>
                  <div className="text-center flex-1">
                    <div className="text-[10px] sm:text-xs text-gray-600 mb-1">CPU</div>
                    <div className="text-xl sm:text-2xl font-bold text-red-600">{computerWins}</div>
                  </div>
                </div>

                {/* Compact Game Arena */}
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-3 sm:p-6 mb-3 sm:mb-4">
                  <div className="flex items-center justify-between">
                    {/* Player Side */}
                    <div className="text-center flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-green-800 mb-1 sm:mb-2">You</h3>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-choice">
                        <div className="text-3xl sm:text-4xl md:text-5xl transition-all duration-300">{playerChoice}</div>
                      </div>
                    </div>

                    {/* Result in Center */}
                    <div className="text-center flex-1 px-1 sm:px-4 relative">
                      <div style={{ opacity: showResult ? 1 : 0 }} className="transition-opacity duration-300 relative z-10">
                        <div className="text-2xl sm:text-3xl mb-1">{roundResult.icon}</div>
                        <div className={roundResult.className}>{roundResult.text}</div>
                        <div className="text-[10px] sm:text-xs text-gray-600 mt-1">{roundResult.explanation}</div>
                      </div>
                    </div>

                    {/* Computer Side */}
                    <div className="text-center flex-1">
                      <h3 className="text-xs sm:text-sm font-bold text-red-800 mb-1 sm:mb-2">Computer</h3>
                      <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-choice">
                        <div className="text-3xl sm:text-4xl md:text-5xl transition-all duration-300">{computerChoice}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Move Selection */}
                <div className="text-center mb-3 sm:mb-4">
                  <div className="text-xs sm:text-sm font-semibold text-gray-700 mb-2 sm:mb-3">
                    <span className="inline-block">Pick Your Move</span>
                    <span className="hidden sm:inline text-xs text-gray-500 ml-2">(or press R, P, S)</span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 max-w-lg mx-auto">
                    <button onClick={() => makeChoice('rock')} disabled={roundInProgress} className="choice-btn bg-gradient-to-br from-gray-200 to-gray-300 hover:from-gray-300 hover:to-gray-400 rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="text-3xl sm:text-4xl mb-1">🪨</div>
                      <div className="font-bold text-gray-800 text-xs sm:text-sm">Rock</div>
                      <div className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">(R)</div>
                    </button>
                    <button onClick={() => makeChoice('paper')} disabled={roundInProgress} className="choice-btn bg-gradient-to-br from-blue-200 to-blue-300 hover:from-blue-300 hover:to-blue-400 rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="text-3xl sm:text-4xl mb-1">📄</div>
                      <div className="font-bold text-gray-800 text-xs sm:text-sm">Paper</div>
                      <div className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">(P)</div>
                    </button>
                    <button onClick={() => makeChoice('scissors')} disabled={roundInProgress} className="choice-btn bg-gradient-to-br from-red-200 to-red-300 hover:from-red-300 hover:to-red-400 rounded-xl p-3 sm:p-4 transition-all transform active:scale-95 shadow-md hover:shadow-lg touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed">
                      <div className="text-3xl sm:text-4xl mb-1">✂️</div>
                      <div className="font-bold text-gray-800 text-xs sm:text-sm">Scissors</div>
                      <div className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">(S)</div>
                    </button>
                  </div>
                </div>

                {/* Game Controls */}
                <div className="text-center flex justify-center gap-2 sm:gap-3">
                  <button onClick={resetGame} className="bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-xs sm:text-sm">
                    🔄 New Game
                  </button>
                </div>

                {/* Final Game Result Overlay */}
                {showFinalResult && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ margin: 0 }}>
                    <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md w-full mx-4 text-center shadow-2xl">
                      <div className="text-5xl sm:text-6xl mb-3 sm:mb-4">{finalResultData.icon}</div>
                      <h2 className={finalResultData.titleClass}>{finalResultData.title}</h2>
                      <div className="text-base sm:text-lg text-gray-700 mb-4 sm:mb-6">
                        {finalResultData.message}
                      </div>
                      <button onClick={resetGame} className="bg-yellow-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-lg hover:bg-yellow-700 transition-colors font-semibold text-sm sm:text-base">
                        🎮 Play Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
{/* Right Sidebar - 320px */}
          <div className="w-full lg:w-[320px] space-y-3 sm:space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Game Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">Game Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-xs font-semibold text-green-700">Your Wins</span>
                  <span className="text-lg font-bold text-green-600">{playerWins}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-xs font-semibold text-red-700">Computer Wins</span>
                  <span className="text-lg font-bold text-red-600">{computerWins}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs font-semibold text-gray-700">Draws</span>
                  <span className="text-lg font-bold text-gray-600">{draws}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xs font-semibold text-yellow-700">Win Rate</span>
                  <span className="text-lg font-bold text-yellow-600">{winRate}%</span>
                </div>
              </div>
            </div>

            {/* Ad Banner */}
            <div className="bg-gray-50 rounded-xl p-2">
              <AdBanner bannerId="rightSidebarAd" />
            </div>

            {/* Quick Tips */}
            <div className="bg-gradient-to-br from-yellow-50 to-red-50 rounded-xl shadow-lg p-4">
              <h3 className="text-base font-bold text-yellow-800 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-xs text-yellow-700">
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Rock beats Scissors</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Scissors beats Paper</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Paper beats Rock</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-yellow-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Use keyboard: R, P, S keys</span>
                </li>
              </ul>
            </div>
{/* Related Games */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">Related Games</h3>
              <div className="space-y-2">
                {relatedGames.map((game, index) => (
                  <Link
                    key={index}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    href={game.href}
                  >
                    <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                      🎮
                    </div>
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{game.title}</div>
                      <div className="text-xs text-gray-500">{game.description}</div>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-yellow-600 hover:text-yellow-700 font-medium">
                View All Games →
              </Link>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
          </div>
        </div>

        {/* Strategy Tips */}
        <div className="mt-6 sm:mt-8 lg:mt-12 bg-yellow-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-3 sm:mb-4">Strategy Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-yellow-700">
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🎲 Stay Unpredictable</h4>
              <p className="text-xs sm:text-sm">Humans tend to follow patterns. Mix up your choices randomly to keep the computer (and human opponents) guessing.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🔄 Break Patterns</h4>
              <p className="text-xs sm:text-sm">If you notice you&apos;re repeating moves, consciously switch it up. Variety is key to winning!</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">⚡ Quick Decisions</h4>
              <p className="text-xs sm:text-sm">In quick play mode, make fast decisions. Overthinking can lead to predictable patterns.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🏆 Tournament Strategy</h4>
              <p className="text-xs sm:text-sm">In 10-round tournaments, track what works. Adjust your strategy based on your win rate.</p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Rock Paper Scissors: The Universal Game</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Rock Paper Scissors (also known as Roshambo) is one of the world&apos;s most universal games, played across
            cultures for centuries. First documented in China during the Han Dynasty (206 BCE - 220 CE), the game has
            become a global phenomenon used for everything from playground disputes to professional tournaments. Despite
            its simplicity, the game involves fascinating elements of psychology and game theory.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
              <h3 className="font-semibold text-gray-800 mb-2">🪨 Rock</h3>
              <p className="text-sm text-gray-600">Crushes scissors. Often chosen first by beginners due to its feeling of strength.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">📄 Paper</h3>
              <p className="text-sm text-gray-600">Covers rock. Statistically the least chosen option in casual games.</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">✂️ Scissors</h3>
              <p className="text-sm text-gray-600">Cuts paper. The most popular choice in competitive play.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-gray-100 to-blue-100 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Game Theory & Psychology</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              While often considered a game of chance, Rock Paper Scissors has been extensively studied by game theorists
              and psychologists. Research shows that humans are predictably non-random - after winning, players tend to
              repeat their choice; after losing, they often switch to what would have beaten them. Knowing these patterns
              can give skilled players a significant edge. The optimal strategy against random play is to also play randomly!
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Strategic Insights</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-gray-500">•</span>
                <span>First-time players often choose Rock - play Paper as an opening move</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Winners tend to repeat their winning choice - play what beats it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Losers often switch to what would have won - anticipate this pattern</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-green-500">•</span>
                <span>Against skilled opponents, true randomness is the optimal strategy</span>
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

      <style jsx>{`
        .choice-btn {
          position: relative;
          overflow: hidden;
          -webkit-tap-highlight-color: transparent;
          user-select: none;
        }

        .choice-btn:disabled:hover {
          transform: none !important;
        }

        .choice-btn:not(:disabled):active {
          transform: scale(0.95) !important;
        }

        @media (hover: hover) and (pointer: fine) {
          .choice-btn:not(:disabled):hover {
            transform: scale(1.05);
          }

          .game-mode-btn:hover {
            transform: translateY(-2px);
          }
        }

        @media (hover: none) and (pointer: coarse) {
          .choice-btn:not(:disabled):active {
            transform: scale(0.9) !important;
          }
        }

        @keyframes pulse-scale {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .animate-choice {
          animation: pulse-scale 2s ease-in-out infinite;
        }

        @keyframes bounce-subtle {
          0%, 100% {
            transform: translateY(0);
          }
          25% {
            transform: translateY(-8px);
          }
          50% {
            transform: translateY(-4px);
          }
          75% {
            transform: translateY(-2px);
          }
        }

        .animate-bounce-subtle {
          animation: bounce-subtle 0.6s ease-out;
        }
      `}</style>
    </>
  );
}
