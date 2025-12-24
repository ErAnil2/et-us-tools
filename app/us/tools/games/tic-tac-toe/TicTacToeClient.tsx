'use client';

import { useState, useCallback } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you play Tic-Tac-Toe?',
    answer: 'Players take turns placing their marks (X or O) in empty squares on a 3x3 grid. The first player to get three marks in a row (horizontally, vertically, or diagonally) wins.',
    order: 1
  },
  {
    id: '2',
    question: 'Can I play against the computer?',
    answer: 'Yes! You can play against an AI opponent with three difficulty levels: Easy (random moves), Medium (some strategy), and Hard (unbeatable perfect play).',
    order: 2
  },
  {
    id: '3',
    question: 'What is the best opening move in Tic-Tac-Toe?',
    answer: 'The center square is generally considered the strongest opening move, as it gives you the most opportunities to create winning combinations.',
    order: 3
  },
  {
    id: '4',
    question: 'Can Tic-Tac-Toe always end in a draw?',
    answer: 'Yes, with perfect play from both players, Tic-Tac-Toe will always end in a draw. This makes it a "solved" game.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I play with a friend?',
    answer: 'Absolutely! Choose "vs Human" mode to play against another person on the same device, taking turns.',
    order: 5
  },
  {
    id: '6',
    question: 'Does the game track scores?',
    answer: 'Yes! The game tracks wins for both X and O players, as well as the number of draws across multiple rounds.',
    order: 6
  }
];

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface Props {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

type Player = 'X' | 'O' | '';
type GameMode = 'ai' | 'human';
type Difficulty = 'easy' | 'medium' | 'hard';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
  [0, 4, 8], [2, 4, 6] // Diagonals
];

export default function TicTacToeClient({ relatedGames = defaultRelatedGames }: Props) {
  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('tic-tac-toe');

  const webAppSchema = generateWebAppSchema({
    name: 'Tic-Tac-Toe - Free Online X and O Game',
    description: 'Play Tic-Tac-Toe online for free. Challenge the AI or play with friends. Multiple difficulty levels. Classic strategy game for all ages.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/tic-tac-toe',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });

  const [gameStarted, setGameStarted] = useState(false);
  const [board, setBoard] = useState<Player[]>(Array(9).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<'X' | 'O'>('X');
  const [playerSymbol, setPlayerSymbol] = useState<'X' | 'O'>('X');
  const [gameMode, setGameMode] = useState<GameMode>('ai');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 });
  const [gameActive, setGameActive] = useState(false);
  const [winningCells, setWinningCells] = useState<number[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<{ winner: 'X' | 'O' | 'draw' | null; message: string }>({ winner: null, message: '' });

  const aiSymbol = playerSymbol === 'X' ? 'O' : 'X';

  const checkWinnerForPlayer = useCallback((boardState: Player[], player: 'X' | 'O') => {
    return WINNING_COMBINATIONS.some(combination =>
      combination.every(index => boardState[index] === player)
    );
  }, []);

  const getAvailableMoves = useCallback((boardState: Player[]) => {
    return boardState.map((cell, index) => cell === '' ? index : null).filter(val => val !== null) as number[];
  }, []);

  const getRandomMove = useCallback((boardState: Player[]) => {
    const availableMoves = getAvailableMoves(boardState);
    if (availableMoves.length === 0) return -1;
    return availableMoves[Math.floor(Math.random() * availableMoves.length)];
  }, [getAvailableMoves]);

  const getBestMove = useCallback((boardState: Player[], aiSym: 'X' | 'O', playerSym: 'X' | 'O') => {
    // First, try to win
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        const newBoard = [...boardState];
        newBoard[i] = aiSym;
        if (checkWinnerForPlayer(newBoard, aiSym)) {
          return i;
        }
      }
    }

    // Second, try to block player from winning
    for (let i = 0; i < 9; i++) {
      if (boardState[i] === '') {
        const newBoard = [...boardState];
        newBoard[i] = playerSym;
        if (checkWinnerForPlayer(newBoard, playerSym)) {
          return i;
        }
      }
    }

    // Third, take center if available
    if (boardState[4] === '') {
      return 4;
    }

    // Fourth, take corners
    const corners = [0, 2, 6, 8];
    const availableCorners = corners.filter(corner => boardState[corner] === '');
    if (availableCorners.length > 0) {
      return availableCorners[Math.floor(Math.random() * availableCorners.length)];
    }

    // Finally, take any available move
    return getRandomMove(boardState);
  }, [checkWinnerForPlayer, getRandomMove]);

  const showResult = useCallback((winner: 'X' | 'O' | 'draw', newScores: typeof scores) => {
    let message = '';

    if (winner === 'draw') {
      message = "It's a Draw! No one wins this round.";
    } else {
      if (gameMode === 'ai') {
        if (winner === playerSymbol) {
          message = 'You Win! Three in a row!';
        } else {
          message = 'AI Wins! Better luck next time.';
        }
      } else {
        message = `Player ${winner} Wins! Three in a row!`;
      }
    }

    setGameResult({ winner, message });
    setScores(newScores);
    setShowModal(true);
  }, [gameMode, playerSymbol]);

  const checkGameEnd = useCallback((boardState: Player[], currentScores: typeof scores) => {
    // Check for winner
    for (const player of ['X', 'O'] as const) {
      if (checkWinnerForPlayer(boardState, player)) {
        const winningCombination = WINNING_COMBINATIONS.find(combination =>
          combination.every(index => boardState[index] === player)
        );
        if (winningCombination) {
          setWinningCells(winningCombination);
        }
        setGameActive(false);
        const newScores = { ...currentScores, [player]: currentScores[player] + 1 };
        showResult(player, newScores);
        return true;
      }
    }

    // Check for draw
    if (boardState.every(cell => cell !== '')) {
      setGameActive(false);
      const newScores = { ...currentScores, draws: currentScores.draws + 1 };
      showResult('draw', newScores);
      return true;
    }

    return false;
  }, [checkWinnerForPlayer, showResult]);

  const makeAIMove = useCallback((boardState: Player[], currentScores: typeof scores) => {
    let move: number;

    switch (difficulty) {
      case 'easy':
        move = getRandomMove(boardState);
        break;
      case 'medium':
        move = Math.random() < 0.5 ? getBestMove(boardState, aiSymbol, playerSymbol) : getRandomMove(boardState);
        break;
      case 'hard':
        move = getBestMove(boardState, aiSymbol, playerSymbol);
        break;
      default:
        move = getRandomMove(boardState);
    }

    if (move !== -1) {
      const newBoard = [...boardState];
      newBoard[move] = aiSymbol;
      setBoard(newBoard);

      if (!checkGameEnd(newBoard, currentScores)) {
        setCurrentPlayer(playerSymbol);
      }
    }
  }, [difficulty, aiSymbol, playerSymbol, getRandomMove, getBestMove, checkGameEnd]);

  const handleCellClick = (index: number) => {
    if (!gameActive || board[index] !== '') return;

    // In AI mode, only allow player to move on their turn
    if (gameMode === 'ai' && currentPlayer !== playerSymbol) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;
    setBoard(newBoard);

    if (checkGameEnd(newBoard, scores)) {
      return;
    }

    const nextPlayer = currentPlayer === 'X' ? 'O' : 'X';
    setCurrentPlayer(nextPlayer);

    // AI move
    if (gameMode === 'ai' && nextPlayer !== playerSymbol) {
      setTimeout(() => makeAIMove(newBoard, scores), 500);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    newRound();
  };

  const newRound = () => {
    setBoard(Array(9).fill(''));
    setCurrentPlayer('X');
    setGameActive(true);
    setWinningCells([]);

    // If AI goes first and is X
    if (gameMode === 'ai' && playerSymbol === 'O') {
      setTimeout(() => {
        const emptyBoard: Player[] = Array(9).fill('');
        makeAIMove(emptyBoard, scores);
      }, 500);
    }
  };

  const resetScores = () => {
    setScores({ X: 0, O: 0, draws: 0 });
    newRound();
  };

  const getPlayerName = (player: 'X' | 'O') => {
    if (gameMode === 'human') {
      return player === 'X' ? 'Player 1' : 'Player 2';
    }
    return player === playerSymbol ? 'You' : 'AI';
  };

  const getCurrentTurnText = () => {
    if (gameMode === 'ai') {
      return currentPlayer === playerSymbol ? 'Your turn' : 'AI thinking...';
    }
    return `Player ${currentPlayer}'s turn`;
  };

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

      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-blue-50">
        <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
          {/* Header */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-100 to-blue-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4">
              <span className="text-xl sm:text-2xl">⭕</span>
              <span className="text-red-600 font-semibold text-sm sm:text-base">Tic-Tac-Toe</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">
              {getH1('Tic-Tac-Toe Classic')}
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
              {getSubHeading('The timeless strategy game! Get three in a row to win.')}
            </p>
          </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

          <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
            {/* Left Column: Game */}
            <div>
              {/* Game Container */}
              <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
                {/* Game Setup */}
                {!gameStarted && (
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Game Settings</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto mb-8">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-3">Game Mode</label>
                        <select
                          value={gameMode}
                          onChange={(e) => setGameMode(e.target.value as GameMode)}
                          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                        >
                          <option value="ai">vs Computer</option>
                          <option value="human">vs Human</option>
                        </select>
                      </div>

                      {gameMode === 'ai' && (
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-3">AI Difficulty</label>
                          <select
                            value={difficulty}
                            onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                          >
                            <option value="easy">Easy (Random moves)</option>
                            <option value="medium">Medium (Some strategy)</option>
                            <option value="hard">Hard (Unbeatable)</option>
                          </select>
                        </div>
                      )}
                    </div>

                    <div className="mb-8">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Your Symbol</label>
                      <div className="flex justify-center gap-4">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="playerSymbol"
                            value="X"
                            checked={playerSymbol === 'X'}
                            onChange={() => setPlayerSymbol('X')}
                            className="mr-2"
                          />
                          <span className="text-2xl font-bold text-red-600">X</span>
                        </label>
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="radio"
                            name="playerSymbol"
                            value="O"
                            checked={playerSymbol === 'O'}
                            onChange={() => setPlayerSymbol('O')}
                            className="mr-2"
                          />
                          <span className="text-2xl font-bold text-blue-600">O</span>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={startGame}
                      className="bg-gradient-to-r from-red-600 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-blue-700 transition-all"
                    >
                      Start Game
                    </button>
                  </div>
                )}

                {/* Game Play */}
                {gameStarted && (
                  <div>
                    {/* Game Stats */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                      <div className="bg-red-50 rounded-lg p-4 text-center">
                        <h4 className="font-semibold text-red-800 mb-2">Player X</h4>
                        <div className="text-2xl font-bold text-red-600">{scores.X}</div>
                        <div className="text-sm text-gray-600">{getPlayerName('X')}</div>
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 text-center">
                        <h4 className="font-semibold text-gray-800 mb-2">Draws</h4>
                        <div className="text-2xl font-bold text-gray-600">{scores.draws}</div>
                        <div className="text-sm text-gray-600">Ties</div>
                      </div>
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <h4 className="font-semibold text-blue-800 mb-2">Player O</h4>
                        <div className="text-2xl font-bold text-blue-600">{scores.O}</div>
                        <div className="text-sm text-gray-600">{getPlayerName('O')}</div>
                      </div>
                    </div>

                    {/* Current Player */}
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center gap-3 px-6 py-3 rounded-full ${
                        gameMode === 'ai'
                          ? currentPlayer === playerSymbol
                            ? 'bg-green-50'
                            : 'bg-orange-50'
                          : currentPlayer === 'X'
                            ? 'bg-red-50'
                            : 'bg-blue-50'
                      }`}>
                        <span className={`text-2xl font-bold ${
                          currentPlayer === 'X' ? 'text-red-600' : 'text-blue-600'
                        }`}>{currentPlayer}</span>
                        <span className={`font-semibold ${
                          gameMode === 'ai'
                            ? currentPlayer === playerSymbol
                              ? 'text-green-600'
                              : 'text-orange-600'
                            : currentPlayer === 'X'
                              ? 'text-red-600'
                              : 'text-blue-600'
                        }`}>{getCurrentTurnText()}</span>
                      </div>
                    </div>

                    {/* Game Board */}
                    <div className="flex justify-center mb-8">
                      <div className="grid grid-cols-3 gap-2 bg-gray-200 p-4 rounded-2xl">
                        {board.map((cell, index) => (
                          <button
                            key={index}
                            onClick={() => handleCellClick(index)}
                            disabled={!gameActive || cell !== ''}
                            className={`w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 bg-white rounded-lg shadow-sm flex items-center justify-center text-3xl sm:text-4xl md:text-5xl font-bold hover:bg-gray-50 transition-colors select-none ${
                              cell === 'X' ? 'text-red-600' : cell === 'O' ? 'text-blue-600' : ''
                            } ${winningCells.includes(index) ? 'bg-yellow-100 animate-pulse' : ''} ${
                              !gameActive || cell !== '' ? 'cursor-not-allowed' : ''
                            }`}
                          >
                            {cell}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Game Controls */}
                    <div className="text-center mb-6 flex flex-wrap justify-center gap-3">
                      <button
                        onClick={newRound}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        New Round
                      </button>
                      <button
                        onClick={resetScores}
                        className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                      >
                        Reset Scores
                      </button>
                      <button
                        onClick={() => setGameStarted(false)}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                      >
                        Change Settings
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Strategy Tips */}
              <div className="mt-6 bg-gradient-to-br from-red-50 to-blue-50 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Strategy Tips</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-red-600">Control the Center</h4>
                    <p className="text-sm">The center square gives you the most winning opportunities.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-600">Block Your Opponent</h4>
                    <p className="text-sm">Always watch for two in a row and block them.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-red-600">Create Multiple Threats</h4>
                    <p className="text-sm">Set up situations where you can win in multiple ways.</p>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <h4 className="font-semibold mb-2 text-blue-600">Think Ahead</h4>
                    <p className="text-sm">Consider what your opponent might do in response.</p>
                  </div>
                </div>
              </div>
            </div>
{/* Right Column: Sidebar */}
            <div className="space-y-4 lg:w-[320px]">
              {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="w-full" />

              {/* Game Info */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-base font-bold text-gray-800 mb-3">How to Play</h3>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">1.</span>
                    <span>Choose your symbol (X or O)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">2.</span>
                    <span>Take turns placing marks on the grid</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-red-500 font-bold">3.</span>
                    <span>Get three in a row to win!</span>
                  </li>
                </ul>
              </div>
{/* Related Games */}
              <div className="bg-white rounded-xl shadow-lg p-4">
                <h3 className="text-base font-bold text-gray-800 mb-3">Related Games</h3>
                <div className="space-y-2">
                  {relatedGames.slice(0, 4).map((game, index) => (
                    <Link
                      key={index}
                      href={game.href}
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className={`w-10 h-10 ${game.color} rounded-lg flex items-center justify-center text-white text-lg`}>
                        {game.icon === 'game' ? '🎮' : game.icon === 'puzzle' ? '🧩' : game.icon === 'memory' ? '🧠' : '🎯'}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800 text-sm">{game.title}</div>
                        <div className="text-xs text-gray-500">{game.description}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
            </div>
          </div>

          {/* Game Over Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
              <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-md w-full text-center shadow-2xl border-4 border-red-200">
                <div className="text-6xl sm:text-7xl mb-4">
                  {gameResult.winner === 'draw' ? '🤝' : gameResult.winner === playerSymbol ? '🎉' : '🤖'}
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3">
                  {gameResult.message}
                </h2>
                <div className="bg-gray-100 rounded-lg p-4 mb-6">
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div>
                      <div className="text-xl font-bold text-red-600">{scores.X}</div>
                      <div className="text-xs text-gray-600">Player X</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-gray-600">{scores.draws}</div>
                      <div className="text-xs text-gray-600">Draws</div>
                    </div>
                    <div>
                      <div className="text-xl font-bold text-blue-600">{scores.O}</div>
                      <div className="text-xs text-gray-600">Player O</div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => {
                      setShowModal(false);
                      newRound();
                    }}
                    className="flex-1 min-h-[52px] px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg"
                  >
                    Play Again
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="flex-1 min-h-[52px] px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 transition-all shadow-lg"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* SEO Content Section */}
          <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Tic-Tac-Toe: The Classic Strategy Game</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Tic-Tac-Toe, also known as Noughts and Crosses or X's and O's, is one of the world's most ancient and widely recognized games. Archaeological evidence suggests variations existed over 3,000 years ago in ancient Egypt. Its simplicity has made it a universal teaching tool for game theory, logical thinking, and basic strategy, while remaining entertaining for players of all ages.
            </p>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-red-50 rounded-xl p-4 border border-red-100">
                <h3 className="font-semibold text-red-800 mb-2">❌ Player X</h3>
                <p className="text-sm text-gray-600">X always moves first, giving a slight strategic advantage in the opening.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">⭕ Player O</h3>
                <p className="text-sm text-gray-600">O responds second but can force draws with perfect defensive play.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">🎯 Win Condition</h3>
                <p className="text-sm text-gray-600">Get three marks in a row horizontally, vertically, or diagonally.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2">🤝 Perfect Play</h3>
                <p className="text-sm text-gray-600">With optimal strategy from both players, the game always ends in a draw.</p>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Winning Strategies</h3>
            <div className="bg-gradient-to-r from-red-50 to-blue-50 rounded-xl p-5 mb-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Take the Center</h4>
                  <p className="text-sm text-gray-600">The center square offers the most winning possibilities and is the strongest opening move.</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Control Corners</h4>
                  <p className="text-sm text-gray-600">Corners are more valuable than edges, offering two potential winning lines each.</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Create Forks</h4>
                  <p className="text-sm text-gray-600">Set up positions where you have two ways to win, forcing your opponent into a losing position.</p>
                </div>
                <div>
                  <h4 className="font-medium text-red-700 mb-2">Block Threats</h4>
                  <p className="text-sm text-gray-600">Always check if your opponent has two in a row before making offensive moves.</p>
                </div>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-800 mb-3">Educational Value</h3>
            <p className="text-gray-600 leading-relaxed">
              Tic-Tac-Toe serves as an excellent introduction to game theory and strategic thinking. It teaches concepts like looking ahead, recognizing patterns, and understanding that some games are "solved"—meaning perfect play always leads to a predetermined outcome. For computer science students, it's often the first game used to learn AI programming and the minimax algorithm.
            </p>
          </div>

          {/* Mobile MREC2 - Before FAQs */}


          <GameAppMobileMrec2 />



          {/* FAQs Section */}
          <div className="mt-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="tic-tac-toe" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
      </div>
    </>
  );
}
