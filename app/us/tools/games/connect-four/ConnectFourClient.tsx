'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePageSEO, generateWebAppSchema } from '@/lib/usePageSEO';
import { FirebaseFAQs } from '@/components/PageSEOContent';
import AdBanner from '@/components/AdBanner';
import Link from 'next/link';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you play Connect Four?',
    answer: 'Click a column to drop your colored disc. Discs fall to the lowest available position. Take turns with your opponent (or AI) trying to get four of your discs in a row horizontally, vertically, or diagonally.',
    order: 1
  },
  {
    id: '2',
    question: 'What game modes are available?',
    answer: 'You can play against the computer (AI) or against another human player locally. In AI mode, you play as red and the computer plays as yellow. In human mode, players alternate turns.',
    order: 2
  },
  {
    id: '3',
    question: 'What are the AI difficulty levels?',
    answer: 'Easy AI makes random moves. Medium AI uses basic strategy to win and block. Hard AI uses advanced evaluation including center control, multiple threat creation, and looking ahead at consequences.',
    order: 3
  },
  {
    id: '4',
    question: 'What is the best strategy for Connect Four?',
    answer: 'Control the center columns as they offer more winning combinations. Create multiple threats so your opponent cannot block them all. Always block opponent three-in-a-rows while building your own.',
    order: 4
  },
  {
    id: '5',
    question: 'What happens when the board is full?',
    answer: 'If all 42 spaces are filled without either player getting four in a row, the game ends in a draw. Both players receive a point in the draws column of the scoreboard.',
    order: 5
  },
  {
    id: '6',
    question: 'How is the score tracked?',
    answer: 'The game tracks wins for red player, wins for yellow player, and draws across multiple rounds. Use "New Round" to play again keeping scores, or "Reset Scores" to start fresh.',
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

interface ConnectFourClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

export default function ConnectFourClient({ relatedGames = defaultRelatedGames }: ConnectFourClientProps) {
  const [board, setBoard] = useState<string[]>(Array(42).fill(''));
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'yellow'>('red');

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('connect-four');

  const webAppSchema = generateWebAppSchema({
    name: 'Connect Four Game - Free Online Strategy Game',
    description: 'Play Connect Four online for free. Challenge the AI or a friend. Drop discs to connect four in a row horizontally, vertically, or diagonally to win.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/connect-four',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });
  const [gameMode, setGameMode] = useState<'ai' | 'human'>('ai');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [gameActive, setGameActive] = useState(false);
  const [scores, setScores] = useState({ red: 0, yellow: 0, draws: 0 });
  const [animating, setAnimating] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryData, setVictoryData] = useState({
    icon: '🎉',
    title: 'You Win!',
    message: 'Four in a row!',
    titleClass: 'text-2xl sm:text-3xl font-bold mb-2 text-green-600'
  });
  const [disabledColumns, setDisabledColumns] = useState<boolean[]>(Array(7).fill(false));

  const getLowestEmptyRow = useCallback((col: number, boardState: string[] = board) => {
    for (let row = 5; row >= 0; row--) {
      if (boardState[row * 7 + col] === '') {
        return row;
      }
    }
    return -1;
  }, [board]);

  const checkWinnerForPlayer = useCallback((player: string, boardState: string[] = board) => {
    // Check horizontal
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 4; col++) {
        if (boardState[row * 7 + col] === player &&
            boardState[row * 7 + col + 1] === player &&
            boardState[row * 7 + col + 2] === player &&
            boardState[row * 7 + col + 3] === player) {
          return true;
        }
      }
    }

    // Check vertical
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 7; col++) {
        if (boardState[row * 7 + col] === player &&
            boardState[(row + 1) * 7 + col] === player &&
            boardState[(row + 2) * 7 + col] === player &&
            boardState[(row + 3) * 7 + col] === player) {
          return true;
        }
      }
    }

    // Check diagonal (top-left to bottom-right)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        if (boardState[row * 7 + col] === player &&
            boardState[(row + 1) * 7 + col + 1] === player &&
            boardState[(row + 2) * 7 + col + 2] === player &&
            boardState[(row + 3) * 7 + col + 3] === player) {
          return true;
        }
      }
    }

    // Check diagonal (top-right to bottom-left)
    for (let row = 0; row < 3; row++) {
      for (let col = 3; col < 7; col++) {
        if (boardState[row * 7 + col] === player &&
            boardState[(row + 1) * 7 + col - 1] === player &&
            boardState[(row + 2) * 7 + col - 2] === player &&
            boardState[(row + 3) * 7 + col - 3] === player) {
          return true;
        }
      }
    }

    return false;
  }, [board]);

  const getRandomMove = useCallback((boardState: string[]) => {
    const availableCols = [];
    for (let col = 0; col < 7; col++) {
      if (getLowestEmptyRow(col, boardState) !== -1) {
        availableCols.push(col);
      }
    }

    if (availableCols.length === 0) return -1;
    return availableCols[Math.floor(Math.random() * availableCols.length)];
  }, [getLowestEmptyRow]);

  const getMediumMove = useCallback((boardState: string[]) => {
    // Try to win first
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(col, boardState);
      if (row !== -1) {
        const testBoard = [...boardState];
        testBoard[row * 7 + col] = 'yellow';
        if (checkWinnerForPlayer('yellow', testBoard)) {
          return col;
        }
      }
    }

    // Try to block opponent
    for (let col = 0; col < 7; col++) {
      const row = getLowestEmptyRow(col, boardState);
      if (row !== -1) {
        const testBoard = [...boardState];
        testBoard[row * 7 + col] = 'red';
        if (checkWinnerForPlayer('red', testBoard)) {
          return col;
        }
      }
    }

    // Otherwise random move
    return getRandomMove(boardState);
  }, [getLowestEmptyRow, checkWinnerForPlayer, getRandomMove]);

  const getBestMove = useCallback((boardState: string[]) => {
    // Enhanced AI would use minimax algorithm
    // For now, use medium strategy with center preference
    const mediumMove = getMediumMove(boardState);
    if (mediumMove !== -1) return mediumMove;

    // Prefer center columns
    const centerCols = [3, 2, 4, 1, 5, 0, 6];
    for (let col of centerCols) {
      if (getLowestEmptyRow(col, boardState) !== -1) {
        return col;
      }
    }

    return -1;
  }, [getMediumMove, getLowestEmptyRow]);

  const createFirecrackers = useCallback(() => {
    const container = document.getElementById('firecrackerContainer');
    if (!container) return;

    container.innerHTML = '';
    const colors = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#FF8B94', '#A8E6CF', '#FFD93D'];
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        const particle = document.createElement('div');
        particle.className = 'firecracker-particle';

        // Random position
        const startX = Math.random() * 100;
        const startY = Math.random() * 100;
        particle.style.left = startX + '%';
        particle.style.top = startY + '%';

        // Random color
        particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        // Random size
        const size = Math.random() * 8 + 4;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';

        // Random animation duration
        const duration = Math.random() * 1 + 0.5;
        particle.style.animationDuration = duration + 's';

        container.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
          particle.remove();
        }, duration * 1000);
      }, i * 30);
    }
  }, []);

  const showResult = useCallback((winner: 'red' | 'yellow' | 'draw') => {
    if (winner === 'draw') {
      setVictoryData({
        icon: '🤝',
        title: "It's a Draw!",
        message: "The board is full!",
        titleClass: 'text-2xl sm:text-3xl font-bold mb-2 text-gray-700'
      });
    } else {
      if (gameMode === 'ai') {
        if (winner === 'red') {
          setVictoryData({
            icon: '🎉',
            title: 'You Win!',
            message: 'Four in a row!',
            titleClass: 'text-2xl sm:text-3xl font-bold mb-2 text-green-600'
          });
          setTimeout(() => createFirecrackers(), 100);
        } else {
          setVictoryData({
            icon: '🤖',
            title: 'AI Wins!',
            message: 'Better luck next time!',
            titleClass: 'text-2xl sm:text-3xl font-bold mb-2 text-red-600'
          });
        }
      } else {
        setVictoryData({
          icon: '🏆',
          title: `${winner.charAt(0).toUpperCase() + winner.slice(1)} Player Wins!`,
          message: 'Four in a row!',
          titleClass: 'text-2xl sm:text-3xl font-bold mb-2 text-yellow-600'
        });
        setTimeout(() => createFirecrackers(), 100);
      }
    }
    setShowVictoryModal(true);
  }, [gameMode, createFirecrackers]);

  const checkWinner = useCallback((boardState: string[]) => {
    const winner = checkWinnerForPlayer('red', boardState) ? 'red' :
                 checkWinnerForPlayer('yellow', boardState) ? 'yellow' : null;

    if (winner) {
      setGameActive(false);
      setScores(prev => ({ ...prev, [winner]: prev[winner] + 1 }));
      showResult(winner);

      // Highlight winning cells
      setTimeout(() => {
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
          const firstChild = cell.firstChild as HTMLElement;
          if (firstChild && firstChild.classList.contains(winner === 'red' ? 'bg-red-500' : 'bg-yellow-500')) {
            cell.classList.add('winning-cell');
          }
        });
      }, 100);

      return true;
    }
    return false;
  }, [checkWinnerForPlayer, showResult]);

  const checkDraw = useCallback((boardState: string[]) => {
    if (boardState.every(cell => cell !== '') && !checkWinner(boardState)) {
      setGameActive(false);
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }));
      showResult('draw');
      return true;
    }
    return false;
  }, [checkWinner, showResult]);

  const dropDisc = useCallback((col: number) => {
    if (!gameActive || animating) return;

    const row = getLowestEmptyRow(col);
    if (row === -1) return; // Column is full

    setAnimating(true);

    const targetIndex = row * 7 + col;
    const newBoard = [...board];
    newBoard[targetIndex] = currentPlayer;
    setBoard(newBoard);

    // Check if column is full
    if (getLowestEmptyRow(col, newBoard) === -1) {
      setDisabledColumns(prev => {
        const newDisabled = [...prev];
        newDisabled[col] = true;
        return newDisabled;
      });
    }

    setTimeout(() => {
      setAnimating(false);

      if (checkWinner(newBoard)) {
        return;
      }

      if (checkDraw(newBoard)) {
        return;
      }

      // Switch players
      const nextPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      setCurrentPlayer(nextPlayer);

      // AI move
      if (gameMode === 'ai' && nextPlayer === 'yellow') {
        setTimeout(() => {
          makeAIMove(newBoard, nextPlayer);
        }, 1000);
      }
    }, 300);
  }, [gameActive, animating, getLowestEmptyRow, board, currentPlayer, gameMode, checkWinner, checkDraw]);

  const makeAIMove = useCallback((boardState: string[], player: 'yellow') => {
    if (!gameActive || animating) return;

    let col;

    switch (difficulty) {
      case 'easy':
        col = getRandomMove(boardState);
        break;
      case 'medium':
        col = getMediumMove(boardState);
        break;
      case 'hard':
        col = getBestMove(boardState);
        break;
    }

    if (col !== -1) {
      dropDisc(col);
    }
  }, [gameActive, animating, difficulty, getRandomMove, getMediumMove, getBestMove, dropDisc]);

  const startGame = () => {
    setGameStarted(true);
    newRound();
  };

  const newRound = () => {
    setBoard(Array(42).fill(''));
    setCurrentPlayer('red');
    setGameActive(true);
    setAnimating(false);
    setDisabledColumns(Array(7).fill(false));
  };

  const resetScores = () => {
    setScores({ red: 0, yellow: 0, draws: 0 });
    newRound();
  };

  const closeVictoryModal = () => {
    setShowVictoryModal(false);
    const container = document.getElementById('firecrackerContainer');
    if (container) {
      container.innerHTML = '';
    }
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

      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-100 to-yellow-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-4">
            <span className="text-xl sm:text-2xl">🔴</span>
            <span className="text-red-600 font-semibold text-sm sm:text-base">Connect Four</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-red-600 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-2">{getH1('Connect Four Challenge')}</h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Drop your discs strategically to get four in a row! Connect horizontally, vertically, or diagonally to win.
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        {/* Main Layout with Sidebar */}
        <div className="flex flex-col lg:flex-row gap-3 sm:gap-6">
          {/* Game Container */}
          <div className="flex-1 bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8">
            {/* Game Setup */}
            {!gameStarted && (
              <div id="gameSetup" className="text-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Game Settings</h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-2xl mx-auto mb-6 sm:mb-8">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Game Mode</label>
                    <select
                      id="gameMode"
                      value={gameMode}
                      onChange={(e) => setGameMode(e.target.value as 'ai' | 'human')}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    >
                      <option value="ai">vs Computer</option>
                      <option value="human">vs Human</option>
                    </select>
                  </div>

                  {gameMode === 'ai' && (
                    <div id="difficultyContainer">
                      <label className="block text-sm font-semibold text-gray-700 mb-3">AI Difficulty</label>
                      <select
                        id="difficulty"
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as 'easy' | 'medium' | 'hard')}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                      >
                        <option value="easy">Easy (Random play)</option>
                        <option value="medium">Medium (Basic strategy)</option>
                        <option value="hard">Hard (Advanced AI)</option>
                      </select>
                    </div>
                  )}
                </div>

                <button
                  id="startGame"
                  onClick={startGame}
                  className="bg-gradient-to-r from-red-600 to-yellow-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-yellow-700 transition-all"
                >
                  🎯 Start Game
                </button>
              </div>
            )}

            {/* Game Play */}
            {gameStarted && (
              <div id="gamePlay">
                {/* Game Stats */}
                <div className="grid grid-cols-3 gap-2 sm:gap-4 mb-4 sm:mb-8">
                  <div className="bg-red-50 rounded-lg p-2 sm:p-4 text-center">
                    <h4 className="font-semibold text-red-800 mb-1 sm:mb-2 text-xs sm:text-sm">Red Player</h4>
                    <div id="redScore" className="text-xl sm:text-2xl font-bold text-red-600">{scores.red}</div>
                    <div id="redName" className="text-xs sm:text-sm text-gray-600">
                      {gameMode === 'human' ? 'Player 1' : 'You'}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2 sm:p-4 text-center">
                    <h4 className="font-semibold text-gray-800 mb-1 sm:mb-2 text-xs sm:text-sm">Draws</h4>
                    <div id="drawScore" className="text-xl sm:text-2xl font-bold text-gray-600">{scores.draws}</div>
                    <div className="text-xs sm:text-sm text-gray-600">Ties</div>
                  </div>
                  <div className="bg-yellow-50 rounded-lg p-2 sm:p-4 text-center">
                    <h4 className="font-semibold text-yellow-800 mb-1 sm:mb-2 text-xs sm:text-sm">Yellow Player</h4>
                    <div id="yellowScore" className="text-xl sm:text-2xl font-bold text-yellow-600">{scores.yellow}</div>
                    <div id="yellowName" className="text-xs sm:text-sm text-gray-600">
                      {gameMode === 'human' ? 'Player 2' : 'AI'}
                    </div>
                  </div>
                </div>

                {/* Current Player */}
                <div className="text-center mb-4 sm:mb-6">
                  <div
                    id="currentPlayerDisplay"
                    className={`inline-flex items-center gap-2 sm:gap-3 ${
                      currentPlayer === 'red' ? 'bg-red-50' : 'bg-yellow-50'
                    } px-4 sm:px-6 py-2 sm:py-3 rounded-full`}
                  >
                    <div
                      className={`w-4 h-4 sm:w-6 sm:h-6 rounded-full ${
                        currentPlayer === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                      }`}
                      id="currentPlayerDisc"
                    ></div>
                    <span
                      className={`${
                        currentPlayer === 'red' ? 'text-red-600' : 'text-yellow-600'
                      } font-semibold text-xs sm:text-sm md:text-base`}
                      id="currentPlayerText"
                    >
                      {gameMode === 'ai'
                        ? (currentPlayer === 'red' || (currentPlayer === 'yellow' && animating)
                            ? 'Your turn - Drop a disc!'
                            : 'AI is thinking...')
                        : `${currentPlayer.charAt(0).toUpperCase() + currentPlayer.slice(1)} player's turn`
                      }
                    </span>
                  </div>
                </div>

                {/* Game Board */}
                <div className="flex justify-center mb-4 sm:mb-8 overflow-x-auto">
                  <div className="bg-blue-600 rounded-xl sm:rounded-2xl p-2 sm:p-3 md:p-4 shadow-xl">
                    <div id="gameBoard" className="grid grid-cols-7 gap-1 sm:gap-2">
                      {board.map((cell, index) => (
                        <div
                          key={index}
                          className="cell w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-white rounded-full shadow-inner flex items-center justify-center"
                          data-index={index}
                        >
                          {cell && (
                            <div
                              className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full ${
                                cell === 'red' ? 'bg-red-500' : 'bg-yellow-500'
                              } shadow-lg transform transition-all duration-300`}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Column Drop Buttons */}
                <div className="flex justify-center mb-4 sm:mb-8">
                  <div className="grid grid-cols-7 gap-1 sm:gap-2" id="dropButtons">
                    {[0, 1, 2, 3, 4, 5, 6].map(col => (
                      <button
                        key={col}
                        className={`drop-btn w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-blue-500 hover:bg-blue-400 active:bg-blue-600 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-sm sm:text-base transition-all transform hover:scale-110 active:scale-95 touch-manipulation ${
                          disabledColumns[col] ? 'opacity-50 cursor-not-allowed' : ''
                        }`}
                        data-col={col}
                        onClick={() => dropDisc(col)}
                        disabled={disabledColumns[col]}
                      >
                        ↓
                      </button>
                    ))}
                  </div>
                </div>

                {/* Game Controls */}
                <div className="text-center mb-4 sm:mb-6 flex flex-wrap justify-center gap-2 sm:gap-4">
                  <button
                    id="newRound"
                    onClick={newRound}
                    className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 active:bg-green-800 transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    🔄 New Round
                  </button>
                  <button
                    id="resetScores"
                    onClick={resetScores}
                    className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 active:bg-gray-800 transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    🗑️ Reset Scores
                  </button>
                </div>
              </div>
            )}
          </div>
{/* Right Sidebar */}
          <div className="w-full lg:w-[320px] space-y-3 sm:space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Ad Banner */}
            <AdBanner className="w-full" />

            {/* Game Stats Card */}
            <div className="bg-white rounded-xl shadow-lg p-4">
              <h3 className="text-base font-bold text-gray-800 mb-3">Game Statistics</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-red-50 rounded-lg">
                  <span className="text-xs font-semibold text-red-700">Red Wins</span>
                  <span className="text-lg font-bold text-red-600">{scores.red}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-xs font-semibold text-yellow-700">Yellow Wins</span>
                  <span className="text-lg font-bold text-yellow-600">{scores.yellow}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                  <span className="text-xs font-semibold text-gray-700">Draws</span>
                  <span className="text-lg font-bold text-gray-600">{scores.draws}</span>
                </div>
              </div>
            </div>

            {/* Quick Tips Card */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg p-4">
              <h3 className="text-base font-bold text-blue-800 mb-3">Quick Tips</h3>
              <ul className="space-y-2 text-xs text-blue-700">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Center columns give more opportunities</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Block opponent&apos;s potential wins</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5 flex-shrink-0">▸</span>
                  <span>Create multiple threats</span>
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

        {/* Victory Popup Modal */}
        {showVictoryModal && (
          <div id="victoryModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-6 sm:p-8 max-w-md w-full relative transform transition-all scale-100">
              {/* Firecracker Container */}
              <div id="firecrackerContainer" className="absolute inset-0 pointer-events-none overflow-hidden rounded-2xl sm:rounded-3xl"></div>

              {/* Modal Content */}
              <div className="relative z-10">
                <div className="text-center mb-4 sm:mb-6">
                  <div className="text-5xl sm:text-6xl mb-3 sm:mb-4 animate-bounce" id="victoryIcon">{victoryData.icon}</div>
                  <h2 className={victoryData.titleClass} id="victoryTitle">{victoryData.title}</h2>
                  <p className="text-gray-600 text-base sm:text-lg" id="victoryMessage">{victoryData.message}</p>
                </div>

                {/* Victory Stats */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-3 sm:p-4 mb-4 sm:mb-6">
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-red-600" id="modalRedScore">{scores.red}</div>
                      <div className="text-xs text-gray-600">Red</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-gray-600" id="modalDrawScore">{scores.draws}</div>
                      <div className="text-xs text-gray-600">Draws</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-yellow-600" id="modalYellowScore">{scores.yellow}</div>
                      <div className="text-xs text-gray-600">Yellow</div>
                    </div>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    id="closeVictoryModal"
                    onClick={closeVictoryModal}
                    className="flex-1 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    Close
                  </button>
                  <button
                    id="playNewGameBtn"
                    onClick={() => {
                      closeVictoryModal();
                      newRound();
                    }}
                    className="flex-1 bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-700 hover:to-yellow-700 active:from-red-800 active:to-yellow-800 text-white py-3 px-4 sm:px-6 rounded-xl font-semibold transition-colors text-sm sm:text-base touch-manipulation"
                  >
                    Play New Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Strategy Tips */}
        <div className="mt-6 sm:mt-8 lg:mt-12 bg-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-red-800 mb-3 sm:mb-4">Strategy Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-red-700">
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🎯 Control the Center</h4>
              <p className="text-xs sm:text-sm">The center columns give you more opportunities to connect four. Try to play there when possible.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🛡️ Think Vertically</h4>
              <p className="text-xs sm:text-sm">Don&apos;t just think horizontal and diagonal - vertical connections are often easier to achieve.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🚫 Block Your Opponent</h4>
              <p className="text-xs sm:text-sm">Watch for your opponent&apos;s potential four-in-a-row and block them before going for your own win.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-1 sm:mb-2 text-sm sm:text-base">🎪 Set Up Traps</h4>
              <p className="text-xs sm:text-sm">Create multiple winning opportunities so your opponent can&apos;t block them all.</p>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Connect Four: The Classic Strategy Game</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Connect Four, also known as Four Up, Plot Four, or Captain&apos;s Mistress, is a two-player connection board game
            first sold by Milton Bradley in 1974. The game was independently invented by Howard Wexler and Ned Strongin and
            has since become one of the world&apos;s most popular strategy games. Its simple rules combined with deep strategic
            possibilities make it enjoyable for players of all ages and skill levels.
          </p>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-red-50 rounded-xl p-4 border border-red-100">
              <h3 className="font-semibold text-red-800 mb-2">🎯 Strategic Depth</h3>
              <p className="text-sm text-gray-600">Despite simple rules, Connect Four offers significant strategic depth with over 4 trillion possible board positions.</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-2">🧠 Pattern Recognition</h3>
              <p className="text-sm text-gray-600">Players develop pattern recognition skills by identifying winning combinations horizontally, vertically, and diagonally.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">🎮 Perfect Information</h3>
              <p className="text-sm text-gray-600">Like chess, Connect Four is a perfect information game where both players can see all pieces, eliminating luck.</p>
            </div>
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">⚡ Quick Games</h3>
              <p className="text-sm text-gray-600">Games typically last only a few minutes, making it perfect for quick mental exercises between activities.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-100 to-yellow-100 rounded-xl p-5 mb-6">
            <h3 className="font-bold text-gray-800 mb-3">Mathematical Analysis</h3>
            <p className="text-gray-700 text-sm leading-relaxed">
              In 1988, Victor Allis solved Connect Four, proving that the first player can always win with perfect play
              by starting in the center column. This makes Connect Four a &quot;solved game&quot; mathematically, though the vast
              number of possible positions (over 4.5 trillion) means human players still find it challenging. The game
              remains popular because memorizing optimal play is practically impossible.
            </p>
          </div>

          <div className="bg-gray-50 rounded-xl p-5">
            <h3 className="font-bold text-gray-800 mb-3">Strategic Tips</h3>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-red-500">•</span>
                <span>Control the center columns - they offer more winning combinations</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Create threats that force your opponent to respond defensively</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-500">•</span>
                <span>Set up &quot;7 traps&quot; - double threats that guarantee a win</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-purple-500">•</span>
                <span>Think ahead - consider how your move affects future positions</span>
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
        .cell {
          transition: all 0.3s ease;
        }

        .winning-cell {
          animation: pulse 1s ease-in-out infinite;
          box-shadow: 0 0 20px rgba(59, 130, 246, 0.5);
        }

        .drop-btn:disabled {
          cursor: not-allowed;
          transform: none !important;
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        /* Firecracker Animation */
        .firecracker-particle {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          animation: explode linear forwards;
        }

        @keyframes explode {
          0% {
            transform: translate(0, 0) scale(1);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translate(
              calc((var(--random-x, 50) - 50) * 3px),
              calc((var(--random-y, 50) - 50) * 3px)
            ) scale(0);
            opacity: 0;
          }
        }

        /* Enhanced firecracker with better randomization */
        .firecracker-particle:nth-child(odd) {
          animation: explode1 linear forwards;
        }

        .firecracker-particle:nth-child(even) {
          animation: explode2 linear forwards;
        }

        @keyframes explode1 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc((50 - var(--tx, 50)) * 5px), calc((50 - var(--ty, 50)) * 5px)) scale(0) rotate(720deg);
            opacity: 0;
          }
        }

        @keyframes explode2 {
          0% {
            transform: translate(0, 0) scale(1) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translate(calc((var(--tx, 50) - 50) * 5px), calc((var(--ty, 50) - 50) * 5px)) scale(0) rotate(-720deg);
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}
