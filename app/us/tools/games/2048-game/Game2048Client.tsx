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
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: 'How do you play 2048?',
    answer: 'Use arrow keys or swipe to move tiles in four directions. When two tiles with the same number touch, they merge into one with their sum. The goal is to create a tile with the number 2048.',
    order: 1
  },
  {
    id: '2',
    question: 'What is the highest possible tile in 2048?',
    answer: 'Theoretically, the highest possible tile is 131072 (2^17), but reaching 2048 is considered winning. Most skilled players aim for tiles like 4096 or 8192.',
    order: 2
  },
  {
    id: '3',
    question: 'What is the best strategy for 2048?',
    answer: 'Keep your highest tile in a corner and build around it. Try to keep tiles organized in descending order, and avoid moving in all four directions randomly.',
    order: 3
  },
  {
    id: '4',
    question: 'Can I undo moves in 2048?',
    answer: 'Yes! This version includes an undo feature that lets you reverse your last move. Use it wisely to correct mistakes.',
    order: 4
  },
  {
    id: '5',
    question: 'Does 2048 save my progress?',
    answer: 'Your best score is automatically saved in your browser. The current game progress is maintained during your session.',
    order: 5
  },
  {
    id: '6',
    question: 'Can I play 2048 on mobile devices?',
    answer: 'Yes! The game supports both keyboard controls (arrow keys) and touch/swipe gestures for mobile play.',
    order: 6
  }
];

interface Game2048ClientProps {
  relatedGames: Array<{
    href: string;
    title: string;
    description: string;
    color: string;
    icon: string;
  }>;
}

export default function Game2048Client({ relatedGames = defaultRelatedGames }: Game2048ClientProps) {
  const [board, setBoard] = useState<number[][]>([]);
  const [score, setScore] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const [moveCount, setMoveCount] = useState(0);
  const [maxTile, setMaxTile] = useState(2);
  const [gameWon, setGameWon] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [previousState, setPreviousState] = useState<any>(null);
  const [showWinModal, setShowWinModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('2048-game');

  const webAppSchema = generateWebAppSchema(
    '2048 Game - Free Online Number Puzzle',
    'Play 2048 online for free. Join numbers to reach 2048 tile in this addictive puzzle game. Features undo, best score tracking, and mobile support.',
    'https://economictimes.indiatimes.com/us/tools/games/2048-game',
    'Game'
  );

  const colors: Record<number, string> = {
    2: '#eee4da',
    4: '#ede0c8',
    8: '#f2b179',
    16: '#f59563',
    32: '#f67c5f',
    64: '#f65e3b',
    128: '#edcf72',
    256: '#edcc61',
    512: '#edc850',
    1024: '#edc53f',
    2048: '#edc22e',
    4096: '#3c3a32',
    8192: '#3c3a32'
  };

  const textColors: Record<number, string> = {
    2: '#776e65',
    4: '#776e65',
    8: '#f9f6f2',
    16: '#f9f6f2',
    32: '#f9f6f2',
    64: '#f9f6f2',
    128: '#f9f6f2',
    256: '#f9f6f2',
    512: '#f9f6f2',
    1024: '#f9f6f2',
    2048: '#f9f6f2',
    4096: '#f9f6f2',
    8192: '#f9f6f2'
  };

  // Initialize game
  const initializeGame = useCallback(() => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    setBoard(newBoard);
    setScore(0);
    setMoveCount(0);
    setMaxTile(2);
    setGameWon(false);
    setGameOver(false);
    setShowWinModal(false);
    setShowGameOverModal(false);

    // Add two random tiles
    const boardWithTiles = addRandomTile(addRandomTile(newBoard));
    setBoard(boardWithTiles);
  }, []);

  // Load best score from localStorage
  useEffect(() => {
    const savedBestScore = localStorage.getItem('2048BestScore');
    if (savedBestScore) {
      setBestScore(parseInt(savedBestScore));
    }
    initializeGame();
  }, [initializeGame]);

  // Update best score
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
      localStorage.setItem('2048BestScore', score.toString());
    }
  }, [score, bestScore]);

  const addRandomTile = (currentBoard: number[][]): number[][] => {
    const emptyCells: Array<{ row: number; col: number }> = [];

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          emptyCells.push({ row, col });
        }
      }
    }

    if (emptyCells.length > 0) {
      const newBoard = currentBoard.map(row => [...row]);
      const randomCell = emptyCells[Math.floor(Math.random() * emptyCells.length)];
      newBoard[randomCell.row][randomCell.col] = Math.random() < 0.9 ? 2 : 4;
      return newBoard;
    }

    return currentBoard;
  };

  const slideArray = (arr: number[]): { newArr: number[]; scoreGained: number } => {
    const filtered = arr.filter(val => val !== 0);
    let scoreGained = 0;

    for (let i = 0; i < filtered.length - 1; i++) {
      if (filtered[i] === filtered[i + 1]) {
        filtered[i] *= 2;
        filtered[i + 1] = 0;
        scoreGained += filtered[i];
      }
    }

    const merged = filtered.filter(val => val !== 0);
    const newMissing = 4 - merged.length;
    const newZeros = Array(newMissing).fill(0);

    return { newArr: merged.concat(newZeros), scoreGained };
  };

  const moveLeft = (currentBoard: number[][]): { newBoard: number[][]; moved: boolean; scoreGained: number } => {
    let moved = false;
    let totalScoreGained = 0;
    const newBoard = currentBoard.map(row => [...row]);

    for (let row = 0; row < 4; row++) {
      const { newArr, scoreGained } = slideArray(newBoard[row]);
      if (JSON.stringify(newArr) !== JSON.stringify(newBoard[row])) {
        moved = true;
        newBoard[row] = newArr;
        totalScoreGained += scoreGained;
      }
    }

    return { newBoard, moved, scoreGained: totalScoreGained };
  };

  const moveRight = (currentBoard: number[][]): { newBoard: number[][]; moved: boolean; scoreGained: number } => {
    let moved = false;
    let totalScoreGained = 0;
    const newBoard = currentBoard.map(row => [...row]);

    for (let row = 0; row < 4; row++) {
      const reversedRow = newBoard[row].slice().reverse();
      const { newArr, scoreGained } = slideArray(reversedRow);
      const finalRow = newArr.reverse();
      if (JSON.stringify(finalRow) !== JSON.stringify(newBoard[row])) {
        moved = true;
        newBoard[row] = finalRow;
        totalScoreGained += scoreGained;
      }
    }

    return { newBoard, moved, scoreGained: totalScoreGained };
  };

  const moveUp = (currentBoard: number[][]): { newBoard: number[][]; moved: boolean; scoreGained: number } => {
    let moved = false;
    let totalScoreGained = 0;
    const newBoard = currentBoard.map(row => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
      const { newArr, scoreGained } = slideArray(column);

      if (JSON.stringify(newArr) !== JSON.stringify(column)) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = newArr[row];
        }
        totalScoreGained += scoreGained;
      }
    }

    return { newBoard, moved, scoreGained: totalScoreGained };
  };

  const moveDown = (currentBoard: number[][]): { newBoard: number[][]; moved: boolean; scoreGained: number } => {
    let moved = false;
    let totalScoreGained = 0;
    const newBoard = currentBoard.map(row => [...row]);

    for (let col = 0; col < 4; col++) {
      const column = [newBoard[0][col], newBoard[1][col], newBoard[2][col], newBoard[3][col]];
      const reversedColumn = column.slice().reverse();
      const { newArr, scoreGained } = slideArray(reversedColumn);
      const finalColumn = newArr.reverse();

      if (JSON.stringify(finalColumn) !== JSON.stringify(column)) {
        moved = true;
        for (let row = 0; row < 4; row++) {
          newBoard[row][col] = finalColumn[row];
        }
        totalScoreGained += scoreGained;
      }
    }

    return { newBoard, moved, scoreGained: totalScoreGained };
  };

  const updateMaxTile = (currentBoard: number[][]): number => {
    let max = 2;
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] > max) {
          max = currentBoard[row][col];
        }
      }
    }
    return max;
  };

  const checkWin = (currentBoard: number[][]): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 2048) {
          return true;
        }
      }
    }
    return false;
  };

  const checkGameOver = (currentBoard: number[][]): boolean => {
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (currentBoard[row][col] === 0) {
          return false;
        }
      }
    }

    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        const current = currentBoard[row][col];
        if ((row < 3 && current === currentBoard[row + 1][col]) ||
            (col < 3 && current === currentBoard[row][col + 1])) {
          return false;
        }
      }
    }

    return true;
  };

  const move = useCallback((direction: 'left' | 'right' | 'up' | 'down') => {
    if (gameOver) return;

    setPreviousState({
      board: board.map(row => [...row]),
      score,
      moveCount,
      maxTile
    });

    let result: { newBoard: number[][]; moved: boolean; scoreGained: number };

    switch (direction) {
      case 'left':
        result = moveLeft(board);
        break;
      case 'right':
        result = moveRight(board);
        break;
      case 'up':
        result = moveUp(board);
        break;
      case 'down':
        result = moveDown(board);
        break;
    }

    if (result.moved) {
      const boardWithNewTile = addRandomTile(result.newBoard);
      setBoard(boardWithNewTile);
      setScore(score + result.scoreGained);
      setMoveCount(moveCount + 1);

      const newMaxTile = updateMaxTile(boardWithNewTile);
      setMaxTile(newMaxTile);

      if (!gameWon && checkWin(boardWithNewTile)) {
        setGameWon(true);
        setShowWinModal(true);
      }

      if (checkGameOver(boardWithNewTile)) {
        setGameOver(true);
        setShowGameOverModal(true);
      }
    }
  }, [board, score, moveCount, maxTile, gameOver, gameWon]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gameOver) return;

    switch (e.key) {
      case 'ArrowUp':
        e.preventDefault();
        move('up');
        break;
      case 'ArrowDown':
        e.preventDefault();
        move('down');
        break;
      case 'ArrowLeft':
        e.preventDefault();
        move('left');
        break;
      case 'ArrowRight':
        e.preventDefault();
        move('right');
        break;
    }
  }, [move, gameOver]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
    };
  }, [handleKeyPress]);

  // Touch events for mobile
  useEffect(() => {
    let startX = 0;
    let startY = 0;

    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!startX || !startY) return;

      const endX = e.changedTouches[0].clientX;
      const endY = e.changedTouches[0].clientY;

      const diffX = startX - endX;
      const diffY = startY - endY;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          move('left');
        } else {
          move('right');
        }
      } else {
        if (diffY > 0) {
          move('up');
        } else {
          move('down');
        }
      }

      startX = 0;
      startY = 0;
    };

    const gameBoard = document.getElementById('gameBoard');
    if (gameBoard) {
      gameBoard.addEventListener('touchstart', handleTouchStart);
      gameBoard.addEventListener('touchend', handleTouchEnd);

      return () => {
        gameBoard.removeEventListener('touchstart', handleTouchStart);
        gameBoard.removeEventListener('touchend', handleTouchEnd);
      };
    }
  }, [move]);

  const handleNewGame = () => {
    initializeGame();
  };

  const handleUndo = () => {
    if (previousState) {
      setBoard(previousState.board);
      setScore(previousState.score);
      setMoveCount(previousState.moveCount);
      setMaxTile(previousState.maxTile);
      setPreviousState(null);
    }
  };

  const handleContinueGame = () => {
    setShowWinModal(false);
  };

  const getTileSize = () => {
    if (typeof window !== 'undefined' && window.innerWidth < 400) {
      return 'w-16 h-16 text-base';
    }
    return 'w-[72px] h-[72px] sm:w-20 sm:h-20 text-lg sm:text-xl';
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

      <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 px-4 py-2 rounded-full mb-3 shadow-md">
            <span className="text-xl">2048</span>
            <span className="text-white font-semibold text-sm">Number Puzzle</span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-2">
            {getH1('2048 Number Puzzle Game')}
          </h1>

          <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
            {getSubHeading('Join numbers and get to the 2048 tile! Use arrow keys or swipe to move.')}
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
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">SCORE</div>
                  <div className="text-lg sm:text-xl font-bold">{score.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">BEST</div>
                  <div className="text-lg sm:text-xl font-bold">{bestScore.toLocaleString()}</div>
                </div>
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">MOVES</div>
                  <div className="text-lg sm:text-xl font-bold">{moveCount}</div>
                </div>
                <div className="bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl p-2 sm:p-3 text-center text-white shadow-md">
                  <div className="text-[10px] sm:text-xs font-medium opacity-90">MAX</div>
                  <div className="text-lg sm:text-xl font-bold">{maxTile}</div>
                </div>
              </div>

              {/* Game Board */}
              <div className="flex justify-center mb-4">
                <div
                  id="gameBoard"
                  className="grid grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-[#bbada0] rounded-xl shadow-inner relative"
                  style={{ touchAction: 'none' }}
                >
                  {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                      <div
                        key={`cell-${rowIndex}-${colIndex}`}
                        className={`${getTileSize()} rounded-lg flex items-center justify-center font-bold transition-all duration-150 select-none shadow-sm`}
                        style={{
                          backgroundColor: cell === 0 ? '#cdc1b4' : colors[cell] || '#3c3a32',
                          color: cell === 0 ? 'transparent' : textColors[cell] || '#f9f6f2',
                          fontSize: cell >= 1000 ? '0.875rem' : undefined
                        }}
                      >
                        {cell !== 0 && cell}
                      </div>
                    ))
                  )}

                  {/* Win Overlay */}
                  {showWinModal && (
                    <div className="absolute inset-0 bg-amber-400/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="text-4xl mb-2">🎉</div>
                      <div className="text-2xl font-bold text-white mb-2">You Win!</div>
                      <div className="text-white/90 text-sm mb-4">You reached 2048!</div>
                      <div className="flex gap-2">
                        <button
                          onClick={handleContinueGame}
                          className="px-4 py-2 bg-white text-amber-600 rounded-lg font-semibold text-sm hover:bg-amber-50 transition-colors"
                        >
                          Continue
                        </button>
                        <button
                          onClick={handleNewGame}
                          className="px-4 py-2 bg-amber-600 text-white rounded-lg font-semibold text-sm hover:bg-amber-700 transition-colors"
                        >
                          New Game
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Game Over Overlay */}
                  {showGameOverModal && (
                    <div className="absolute inset-0 bg-gray-800/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm">
                      <div className="text-4xl mb-2">😔</div>
                      <div className="text-2xl font-bold text-white mb-2">Game Over</div>
                      <div className="text-white/80 text-sm mb-4">Final Score: {score.toLocaleString()}</div>
                      <button
                        onClick={handleNewGame}
                        className="px-6 py-2 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Game Controls */}
              <div className="flex justify-center gap-3 mb-4">
                <button
                  onClick={handleNewGame}
                  className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white px-5 py-2.5 rounded-xl hover:from-orange-600 hover:to-amber-600 transition-all font-semibold shadow-md hover:shadow-lg active:scale-95"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New Game
                </button>
                <button
                  onClick={handleUndo}
                  disabled={!previousState}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold shadow-md transition-all active:scale-95 ${
                    previousState
                      ? 'bg-gray-600 text-white hover:bg-gray-700 hover:shadow-lg'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  Undo
                </button>
              </div>

              {/* Controls - Desktop */}
              <div className="hidden sm:block bg-white/60 rounded-xl p-4">
                <div className="text-center text-sm text-gray-600 mb-3 font-medium">Use Arrow Keys or Swipe to Move</div>
                <div className="flex justify-center gap-2">
                  <div className="flex flex-col items-center gap-1">
                    <button onClick={() => move('up')} className="w-12 h-12 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow font-bold text-lg">↑</button>
                    <div className="flex gap-1">
                      <button onClick={() => move('left')} className="w-12 h-12 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow font-bold text-lg">←</button>
                      <button onClick={() => move('down')} className="w-12 h-12 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow font-bold text-lg">↓</button>
                      <button onClick={() => move('right')} className="w-12 h-12 bg-gray-700 text-white rounded-lg hover:bg-gray-800 active:scale-95 transition-all shadow font-bold text-lg">→</button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Mobile Swipe Hint */}
              <div className="sm:hidden text-center text-sm text-gray-500 mt-2">
                Swipe in any direction to move tiles
              </div>
            </div>

            {/* How to Play - Below Game */}
            <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> How to Play
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">1</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Move Tiles</div>
                    <div className="text-gray-600">Use arrow keys or swipe to slide all tiles</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">2</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Merge Numbers</div>
                    <div className="text-gray-600">Same numbers merge when they touch</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">3</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Score Points</div>
                    <div className="text-gray-600">Each merge adds to your score</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-orange-600 font-bold">4</span>
                  </div>
                  <div>
                    <div className="font-semibold text-gray-800">Reach 2048</div>
                    <div className="text-gray-600">Create a 2048 tile to win!</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Strategy Tips */}
            <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-5 border border-orange-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <span className="text-xl">💡</span> Pro Tips
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 text-sm">
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Corner Strategy</div>
                  <div className="text-gray-600">Keep your highest tile in a corner and build around it.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Build in Rows</div>
                  <div className="text-gray-600">Arrange tiles in descending order for easier merging.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Keep Space</div>
                  <div className="text-gray-600">Always maintain some empty cells for maneuvering.</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="font-semibold text-orange-700 mb-1">Think Ahead</div>
                  <div className="text-gray-600">Plan 2-3 moves ahead before making a swipe.</div>
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
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Score</span>
                  <span className="text-2xl font-bold text-blue-600">{score.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gradient-to-r from-amber-50 to-orange-100 rounded-xl">
                  <span className="text-gray-600 font-medium">Best Score</span>
                  <span className="text-2xl font-bold text-amber-600">{bestScore.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Moves</div>
                    <div className="text-xl font-bold text-gray-700">{moveCount}</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-xs text-gray-500">Max Tile</div>
                    <div className="text-xl font-bold text-gray-700">{maxTile}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ad Banner */}
            {/* Ad banner replaced with MREC components */}

            {/* Quick Links */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">More Puzzle Games</h3>
              <div className="space-y-2">
                <Link href="/us/tools/games/chess" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">♟</div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Chess</div>
                    <div className="text-xs text-gray-500">Strategic board game</div>
                  </div>
                </Link>
                <Link href="/us/tools/games/snake-game" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🐍</div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Snake</div>
                    <div className="text-xs text-gray-500">Classic arcade game</div>
                  </div>
                </Link>
                <Link href="/us/tools/games/memory-cards" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🃏</div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Memory Cards</div>
                    <div className="text-xs text-gray-500">Match the pairs</div>
                  </div>
                </Link>
                <Link href="/us/tools/games/tic-tac-toe" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⭕</div>
                  <div>
                    <div className="font-semibold text-gray-800 text-sm">Tic Tac Toe</div>
                    <div className="text-xs text-gray-500">Classic X and O</div>
                  </div>
                </Link>
              </div>
              <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-orange-600 hover:text-orange-700 font-medium">
                View All Games →
              </Link>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Tile Guide */}
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Tile Values</h3>
              <div className="grid grid-cols-4 gap-2">
                {[2, 4, 8, 16, 32, 64, 128, 256].map(num => (
                  <div
                    key={num}
                    className="aspect-square rounded-lg flex items-center justify-center font-bold text-xs shadow-sm"
                    style={{
                      backgroundColor: colors[num],
                      color: textColors[num]
                    }}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding the 2048 Puzzle Game</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            2048 is an iconic single-player sliding tile puzzle game created by Italian web developer Gabriele Cirulli in March 2014. The game quickly became a viral sensation, captivating millions of players worldwide with its simple yet addictive gameplay. Players slide numbered tiles on a 4×4 grid, combining matching numbers to create larger values with the ultimate goal of reaching the elusive 2048 tile.
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
              <h3 className="font-semibold text-orange-800 mb-2">🎯 Objective</h3>
              <p className="text-sm text-gray-600">Combine tiles to create the 2048 tile by merging matching numbers</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2">🧩 Mechanics</h3>
              <p className="text-sm text-gray-600">Tiles slide in four directions; matching tiles merge into their sum</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-4 border border-yellow-100">
              <h3 className="font-semibold text-yellow-800 mb-2">📊 Scoring</h3>
              <p className="text-sm text-gray-600">Each merge adds the new tile value to your score</p>
            </div>
            <div className="bg-lime-50 rounded-xl p-4 border border-lime-100">
              <h3 className="font-semibold text-lime-800 mb-2">🏆 Challenge</h3>
              <p className="text-sm text-gray-600">New tiles appear after each move, filling the limited space</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">The Mathematics Behind 2048</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            The game is based on powers of 2, making it an excellent tool for understanding exponential growth. Starting with 2 and 4 tiles, players must combine them strategically: 2+2=4, 4+4=8, 8+8=16, and so on until reaching 2048 (which is 2¹¹). The theoretical maximum tile achievable is 131,072 (2¹⁷), though this requires perfect play and significant luck.
          </p>

          <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-5 mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Advanced Strategies for High Scores</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Corner Strategy</h4>
                <p className="text-sm text-gray-600">Keep your highest tile in one corner and never move it. Build descending chains along the edges to maximize merging opportunities.</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Monotonic Ordering</h4>
                <p className="text-sm text-gray-600">Arrange tiles in descending order across rows or columns. This creates a "snake" pattern that facilitates efficient merging.</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Minimize Reversals</h4>
                <p className="text-sm text-gray-600">Avoid moving in the direction opposite to your main strategy. Limit yourself to 2-3 directions to maintain control.</p>
              </div>
              <div>
                <h4 className="font-medium text-orange-700 mb-2">Space Management</h4>
                <p className="text-sm text-gray-600">Always maintain at least 2-3 empty cells for maneuverability. A full board with no merges means game over.</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Cognitive Benefits of Playing 2048</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Beyond entertainment, 2048 offers significant cognitive benefits. Regular play improves spatial reasoning, pattern recognition, and strategic planning skills. The game challenges players to think several moves ahead, similar to chess, making it an excellent brain training exercise. Studies suggest puzzle games like 2048 can help maintain cognitive function and improve problem-solving abilities across all age groups.
          </p>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <GameAppMobileMrec2 />



        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="2048-game" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
