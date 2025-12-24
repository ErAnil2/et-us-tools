'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { usePageSEO } from '@/lib/usePageSEO';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';

import { FirebaseFAQs } from '@/components/PageSEOContent';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2, GameAppMobileMrec1, GameAppMobileMrec2 } from '@/components/BannerPlacements';

const fallbackFaqs = [
  {
    question: "What is a crossword puzzle?",
    answer: "A crossword puzzle is a word game where you fill in a grid with words based on numbered clues. Words are arranged horizontally (across) and vertically (down), with letters shared where words intersect."
  },
  {
    question: "How do I solve a crossword puzzle?",
    answer: "Start with the clues you know, fill in those answers, then use the intersecting letters to help solve more difficult clues. Use the 'Hint' button if you get stuck on a particular letter."
  },
  {
    question: "What do the numbers in the grid mean?",
    answer: "The numbers in the grid correspond to the numbered clues. Each number marks the starting cell of a word that goes either across (horizontal) or down (vertical)."
  },
  {
    question: "Can I check my answers as I go?",
    answer: "Yes! Click the 'Check' button at any time to verify your answers. Correct letters will be counted and displayed in the progress bar."
  },
  {
    question: "What difficulty levels are available?",
    answer: "This crossword offers four difficulty levels: Beginner (7x7 grid), Easy (9x9), Medium (11x11), and Hard (13x13). Higher difficulties have larger grids and more challenging vocabulary."
  },
  {
    question: "How do I navigate the crossword grid?",
    answer: "Click any white cell to select it, then type your answer. Use arrow keys to move between cells, or click directly on the cell you want to edit. The backspace key deletes letters and moves backward."
  },
  {
    question: "What are 'across' and 'down' clues?",
    answer: "Across clues are for words that read horizontally from left to right. Down clues are for words that read vertically from top to bottom. Each clue is numbered to match its starting position in the grid."
  },
  {
    question: "Why do some cells have numbers and others don't?",
    answer: "Only the first letter of each word has a number. This number corresponds to the clue number in the Across or Down clue lists. Cells without numbers are part of words but not starting positions."
  },
  {
    question: "What happens when words intersect?",
    answer: "When an across word and a down word share a cell, both words must have the same letter in that position. These intersections help you solve the puzzle by providing cross-checking letters."
  },
  {
    question: "Are crossword puzzles good for brain health?",
    answer: "Yes! Studies suggest that regularly solving crossword puzzles can help improve vocabulary, enhance memory, and may contribute to maintaining cognitive function as you age. They're a fun way to keep your mind sharp."
  },
  {
    question: "How can I improve my crossword solving skills?",
    answer: "Practice regularly, learn common crossword words and abbreviations, start with easier puzzles and work up, and don't be afraid to use the hint feature when stuck. Over time, you'll recognize patterns and solve faster."
  }
];
interface Word {
  word: string;
  clue: string;
  startRow: number;
  startCol: number;
  direction: 'across' | 'down';
}

interface Puzzle {
  size: number;
  words: Word[];
}

interface CellData {
  letter: string;
  wordIndex: number;
  direction: 'across' | 'down';
  isStart: boolean;
}

interface GameStats {
  completed: number;
  totalTime: number;
  totalWords: number;
  bestTime?: number;
  beginnerCount: number;
  easyCount: number;
  mediumCount: number;
  hardCount: number;
}

const puzzles: Record<string, Puzzle> = {
  beginner: {
    size: 7,
    words: [
      { word: 'CAT', clue: 'Feline pet', startRow: 0, startCol: 0, direction: 'across' },
      { word: 'DOG', clue: 'Canine companion', startRow: 1, startCol: 2, direction: 'across' },
      { word: 'SUN', clue: 'Source of light', startRow: 3, startCol: 1, direction: 'across' },
      { word: 'COLD', clue: 'Not hot', startRow: 0, startCol: 0, direction: 'down' },
      { word: 'BIRD', clue: 'Flying animal', startRow: 2, startCol: 2, direction: 'down' },
      { word: 'TREE', clue: 'Woody plant', startRow: 4, startCol: 1, direction: 'down' }
    ]
  },
  easy: {
    size: 9,
    words: [
      { word: 'HOUSE', clue: 'Place to live', startRow: 0, startCol: 2, direction: 'across' },
      { word: 'WATER', clue: 'H2O', startRow: 2, startCol: 1, direction: 'across' },
      { word: 'MUSIC', clue: 'Sounds in harmony', startRow: 4, startCol: 3, direction: 'across' },
      { word: 'HAPPY', clue: 'Feeling joyful', startRow: 6, startCol: 0, direction: 'across' },
      { word: 'CHAIR', clue: 'Furniture to sit on', startRow: 1, startCol: 0, direction: 'down' },
      { word: 'OCEAN', clue: 'Large body of water', startRow: 0, startCol: 4, direction: 'down' },
      { word: 'PHONE', clue: 'Communication device', startRow: 3, startCol: 6, direction: 'down' }
    ]
  },
  medium: {
    size: 11,
    words: [
      { word: 'COMPUTER', clue: 'Electronic calculating machine', startRow: 1, startCol: 1, direction: 'across' },
      { word: 'KEYBOARD', clue: 'Input device with keys', startRow: 3, startCol: 2, direction: 'across' },
      { word: 'INTERNET', clue: 'Global network', startRow: 5, startCol: 0, direction: 'across' },
      { word: 'SOFTWARE', clue: 'Computer programs', startRow: 7, startCol: 3, direction: 'across' },
      { word: 'SCIENCE', clue: 'Study of natural world', startRow: 0, startCol: 5, direction: 'down' },
      { word: 'LIBRARY', clue: 'Place with books', startRow: 2, startCol: 8, direction: 'down' },
      { word: 'HISTORY', clue: 'Study of past events', startRow: 4, startCol: 2, direction: 'down' }
    ]
  },
  hard: {
    size: 13,
    words: [
      { word: 'TECHNOLOGY', clue: 'Applied science', startRow: 2, startCol: 1, direction: 'across' },
      { word: 'INNOVATION', clue: 'New method or idea', startRow: 4, startCol: 2, direction: 'across' },
      { word: 'DEVELOPMENT', clue: 'Process of growing', startRow: 6, startCol: 0, direction: 'across' },
      { word: 'ALGORITHM', clue: 'Step-by-step procedure', startRow: 8, startCol: 3, direction: 'across' },
      { word: 'CREATIVITY', clue: 'Ability to create', startRow: 10, startCol: 1, direction: 'across' },
      { word: 'EDUCATION', clue: 'Process of learning', startRow: 0, startCol: 6, direction: 'down' },
      { word: 'KNOWLEDGE', clue: 'Information and understanding', startRow: 1, startCol: 9, direction: 'down' },
      { word: 'EXPERIENCE', clue: 'Practical contact with events', startRow: 3, startCol: 11, direction: 'down' }
    ]
  }
};

export default function CrosswordClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('crossword');

  const [difficulty, setDifficulty] = useState<string>('easy');
  const [currentPuzzle, setCurrentPuzzle] = useState<Puzzle>(puzzles.easy);
  const [grid, setGrid] = useState<(CellData | null)[][]>([]);
  const [userGrid, setUserGrid] = useState<string[][]>([]);
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [selectedWord, setSelectedWord] = useState<number | null>(null);
  const [selectedDirection, setSelectedDirection] = useState<'across' | 'down'>('across');
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<string>('00:00');
  const [completedCells, setCompletedCells] = useState<number>(0);
  const [correctCells, setCorrectCells] = useState<number>(0);
  const [totalCells, setTotalCells] = useState<number>(0);
  const [showWinModal, setShowWinModal] = useState(false);
  const [stats, setStats] = useState<GameStats>({
    completed: 0,
    totalTime: 0,
    totalWords: 0,
    beginnerCount: 0,
    easyCount: 0,
    mediumCount: 0,
    hardCount: 0
  });

  const inputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    const savedStats = localStorage.getItem('crosswordStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      const elapsed = Date.now() - startTime;
      setTimeSpent(formatTime(elapsed));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  useEffect(() => {
    generatePuzzle();
  }, [difficulty]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const generatePuzzle = useCallback(() => {
    const puzzle = puzzles[difficulty];
    setCurrentPuzzle(puzzle);
    setStartTime(Date.now());
    setShowWinModal(false);
    createGrid(puzzle);
  }, [difficulty]);

  const createGrid = (puzzle: Puzzle) => {
    const size = puzzle.size;
    const newGrid: (CellData | null)[][] = Array(size).fill(null).map(() => Array(size).fill(null));
    const newUserGrid: string[][] = Array(size).fill(null).map(() => Array(size).fill(''));

    puzzle.words.forEach((wordData, index) => {
      const { word, startRow, startCol, direction } = wordData;
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        if (row < size && col < size) {
          newGrid[row][col] = {
            letter: word[i],
            wordIndex: index,
            direction: direction,
            isStart: i === 0
          };
        }
      }
    });

    setGrid(newGrid);
    setUserGrid(newUserGrid);
    updateStatsFromGrid(newUserGrid, puzzle);
  };

  const updateStatsFromGrid = (currentUserGrid: string[][], puzzle: Puzzle) => {
    let completed = 0;
    let correct = 0;
    let total = 0;

    puzzle.words.forEach(wordData => {
      const { word, startRow, startCol, direction } = wordData;
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        total++;
        const userLetter = currentUserGrid[row][col];
        if (userLetter) {
          completed++;
          if (userLetter === word[i]) {
            correct++;
          }
        }
      }
    });

    setCompletedCells(completed);
    setCorrectCells(correct);
    setTotalCells(total);
  };

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col });
    const cellData = grid[row]?.[col];
    if (cellData) {
      selectWord(cellData.wordIndex);
    }
  };

  const selectWord = (wordIndex: number) => {
    setSelectedWord(wordIndex);
    const wordData = currentPuzzle.words[wordIndex];
    setSelectedDirection(wordData.direction);
  };

  const handleInput = (row: number, col: number, value: string) => {
    const newUserGrid = userGrid.map(r => [...r]);
    newUserGrid[row][col] = value.toUpperCase();
    setUserGrid(newUserGrid);
    updateStatsFromGrid(newUserGrid, currentPuzzle);

    if (value && selectedWord !== null) {
      moveToNextCell(row, col);
    }
  };

  const moveToNextCell = (currentRow: number, currentCol: number) => {
    if (selectedWord === null) return;

    const wordData = currentPuzzle.words[selectedWord];
    const { startRow, startCol, direction, word } = wordData;

    let posInWord: number;
    if (direction === 'across') {
      posInWord = currentCol - startCol;
    } else {
      posInWord = currentRow - startRow;
    }

    if (posInWord < word.length - 1) {
      const nextRow = direction === 'across' ? startRow : startRow + posInWord + 1;
      const nextCol = direction === 'across' ? startCol + posInWord + 1 : startCol;
      const key = `${nextRow}-${nextCol}`;
      inputRefs.current[key]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, row: number, col: number) => {
    if (e.key === 'Backspace' && !userGrid[row][col]) {
      e.preventDefault();
      if (selectedWord !== null) {
        const wordData = currentPuzzle.words[selectedWord];
        const { startRow, startCol, direction } = wordData;
        let posInWord: number;
        if (direction === 'across') {
          posInWord = col - startCol;
        } else {
          posInWord = row - startRow;
        }
        if (posInWord > 0) {
          const prevRow = direction === 'across' ? startRow : startRow + posInWord - 1;
          const prevCol = direction === 'across' ? startCol + posInWord - 1 : startCol;
          const key = `${prevRow}-${prevCol}`;
          inputRefs.current[key]?.focus();
        }
      }
    } else if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
      handleArrowKey(e.key, row, col);
    }
  };

  const handleArrowKey = (key: string, row: number, col: number) => {
    let newRow = row;
    let newCol = col;

    switch(key) {
      case 'ArrowUp': newRow = Math.max(0, row - 1); break;
      case 'ArrowDown': newRow = Math.min(currentPuzzle.size - 1, row + 1); break;
      case 'ArrowLeft': newCol = Math.max(0, col - 1); break;
      case 'ArrowRight': newCol = Math.min(currentPuzzle.size - 1, col + 1); break;
    }

    while (newRow !== row || newCol !== col) {
      if (grid[newRow] && grid[newRow][newCol]) {
        const cellKey = `${newRow}-${newCol}`;
        inputRefs.current[cellKey]?.focus();
        handleCellClick(newRow, newCol);
        break;
      }
      if (key === 'ArrowUp') newRow = Math.max(0, newRow - 1);
      else if (key === 'ArrowDown') newRow = Math.min(currentPuzzle.size - 1, newRow + 1);
      else if (key === 'ArrowLeft') newCol = Math.max(0, newCol - 1);
      else if (key === 'ArrowRight') newCol = Math.min(currentPuzzle.size - 1, newCol + 1);

      if ((key === 'ArrowUp' && newRow === 0) ||
          (key === 'ArrowDown' && newRow === currentPuzzle.size - 1) ||
          (key === 'ArrowLeft' && newCol === 0) ||
          (key === 'ArrowRight' && newCol === currentPuzzle.size - 1)) {
        break;
      }
    }
  };

  const checkAnswers = () => {
    let correct = 0;
    let total = 0;

    currentPuzzle.words.forEach(wordData => {
      const { word, startRow, startCol, direction } = wordData;
      for (let i = 0; i < word.length; i++) {
        const row = direction === 'across' ? startRow : startRow + i;
        const col = direction === 'across' ? startCol + i : startCol;
        total++;
        if (userGrid[row][col] === word[i]) {
          correct++;
        }
      }
    });

    if (correct === total) {
      completePuzzle();
    }
    updateStatsFromGrid(userGrid, currentPuzzle);
  };

  const completePuzzle = () => {
    const timeElapsed = Date.now() - startTime;
    setShowWinModal(true);

    const newStats = { ...stats };
    newStats.completed = (newStats.completed || 0) + 1;
    newStats.totalTime = (newStats.totalTime || 0) + timeElapsed;
    newStats.totalWords = (newStats.totalWords || 0) + currentPuzzle.words.length;

    if (!newStats.bestTime || timeElapsed < newStats.bestTime) {
      newStats.bestTime = timeElapsed;
    }

    const difficultyKey = `${difficulty}Count` as keyof GameStats;
    newStats[difficultyKey] = ((newStats[difficultyKey] as number) || 0) + 1;

    setStats(newStats);
    localStorage.setItem('crosswordStats', JSON.stringify(newStats));
  };

  const clearGrid = () => {
    const newUserGrid = Array(currentPuzzle.size).fill(null).map(() => Array(currentPuzzle.size).fill(''));
    setUserGrid(newUserGrid);
    updateStatsFromGrid(newUserGrid, currentPuzzle);
  };

  const revealLetter = () => {
    if (selectedCell) {
      const cellData = grid[selectedCell.row]?.[selectedCell.col];
      if (cellData) {
        const newUserGrid = userGrid.map(r => [...r]);
        newUserGrid[selectedCell.row][selectedCell.col] = cellData.letter;
        setUserGrid(newUserGrid);
        updateStatsFromGrid(newUserGrid, currentPuzzle);
      }
    }
  };

  const acrossWords = currentPuzzle.words.filter(w => w.direction === 'across');
  const downWords = currentPuzzle.words.filter(w => w.direction === 'down');
  const progress = totalCells > 0 ? (correctCells / totalCells) * 100 : 0;

  const getCellSize = () => {
    if (currentPuzzle.size <= 7) return 'w-10 h-10 sm:w-12 sm:h-12';
    if (currentPuzzle.size <= 9) return 'w-8 h-8 sm:w-10 sm:h-10';
    if (currentPuzzle.size <= 11) return 'w-7 h-7 sm:w-9 sm:h-9';
    return 'w-6 h-6 sm:w-8 sm:h-8';
  };

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 px-4 py-2 rounded-full mb-3 shadow-md">
          <span className="text-xl">📝</span>
          <span className="text-white font-semibold text-sm">Word Puzzle</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">{getH1('Crossword Puzzle')}</h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Fill in the grid using the clues. Click a cell to start typing!
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Game Area */}
        <div className="flex-1 min-w-0">
          {/* Game Container */}
          <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-indigo-100">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white/70 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="px-3 py-2 bg-white border border-indigo-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="beginner">Beginner (7x7)</option>
                  <option value="easy">Easy (9x9)</option>
                  <option value="medium">Medium (11x11)</option>
                  <option value="hard">Hard (13x13)</option>
                </select>
                <button
                  onClick={generatePuzzle}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  New
                </button>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={revealLetter}
                  disabled={!selectedCell}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    selectedCell
                      ? 'bg-amber-500 text-white hover:bg-amber-600'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Hint
                </button>
                <button
                  onClick={checkAnswers}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-all"
                >
                  Check
                </button>
                <button
                  onClick={clearGrid}
                  className="bg-gray-500 text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-600 transition-all"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Stats Bar - Mobile */}
            <div className="grid grid-cols-4 gap-2 mb-4 lg:hidden">
              <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">FILLED</div>
                <div className="text-lg font-bold">{completedCells}/{totalCells}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">CORRECT</div>
                <div className="text-lg font-bold">{correctCells}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">TIME</div>
                <div className="text-lg font-bold">{timeSpent}</div>
              </div>
              <div className="bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">PROGRESS</div>
                <div className="text-lg font-bold">{Math.round(progress)}%</div>
              </div>
            </div>

            {/* Crossword Grid */}
            <div className="flex justify-center mb-4">
              <div
                className="grid gap-0.5 sm:gap-1 p-2 sm:p-3 bg-gray-800 rounded-xl shadow-inner relative"
                style={{ gridTemplateColumns: `repeat(${currentPuzzle.size}, 1fr)` }}
              >
                {grid.map((row, rowIndex) =>
                  row.map((cell, colIndex) => {
                    const key = `${rowIndex}-${colIndex}`;

                    if (cell) {
                      const isHighlighted = selectedWord !== null &&
                        currentPuzzle.words[selectedWord] &&
                        (() => {
                          const wordData = currentPuzzle.words[selectedWord];
                          const { startRow, startCol, direction, word } = wordData;
                          for (let i = 0; i < word.length; i++) {
                            const r = direction === 'across' ? startRow : startRow + i;
                            const c = direction === 'across' ? startCol + i : startCol;
                            if (r === rowIndex && c === colIndex) return true;
                          }
                          return false;
                        })();

                      const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                      const cellValue = userGrid[rowIndex][colIndex];

                      return (
                        <div
                          key={key}
                          className={`${getCellSize()} relative bg-white rounded transition-all ${
                            isSelected ? 'ring-2 ring-indigo-500 ring-offset-1' : ''
                          } ${isHighlighted ? 'bg-yellow-100' : ''}`}
                        >
                          {cell.isStart && (
                            <div className="absolute top-0 left-0.5 text-[8px] sm:text-[10px] font-bold text-indigo-600 leading-none">
                              {cell.wordIndex + 1}
                            </div>
                          )}
                          <input
                            ref={(el) => { inputRefs.current[key] = el; }}
                            type="text"
                            maxLength={1}
                            value={cellValue}
                            onChange={(e) => handleInput(rowIndex, colIndex, e.target.value)}
                            onClick={() => handleCellClick(rowIndex, colIndex)}
                            onFocus={() => handleCellClick(rowIndex, colIndex)}
                            onKeyDown={(e) => handleKeyDown(e, rowIndex, colIndex)}
                            className="w-full h-full text-center font-bold text-sm sm:text-lg border-none outline-none bg-transparent uppercase pt-1"
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div key={key} className={`${getCellSize()} bg-gray-800 rounded`} />
                      );
                    }
                  })
                )}

                {/* Win Overlay */}
                {showWinModal && (
                  <div className="absolute inset-0 bg-green-500/95 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm z-10">
                    <div className="text-4xl mb-2">🎉</div>
                    <div className="text-2xl font-bold text-white mb-1">Puzzle Complete!</div>
                    <div className="text-white/90 text-sm mb-4">Time: {timeSpent}</div>
                    <button
                      onClick={generatePuzzle}
                      className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold text-sm hover:bg-green-50 transition-colors"
                    >
                      New Puzzle
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white/60 rounded-xl p-3">
              <div className="flex justify-between text-xs text-gray-600 mb-1.5">
                <span>Progress</span>
                <span>{correctCells}/{totalCells} correct ({Math.round(progress)}%)</span>
              </div>
              <div className="bg-gray-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Clues Section - Below Grid on Mobile */}
          <div className="mt-6 lg:hidden">
            <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Clues</h3>

              {/* Current Word */}
              {selectedWord !== null && (
                <div className="bg-indigo-50 rounded-xl p-3 mb-4 border border-indigo-100">
                  <div className="text-xs text-indigo-600 font-semibold mb-1">
                    {selectedDirection === 'across' ? '→ Across' : '↓ Down'} #{selectedWord + 1}
                  </div>
                  <div className="text-gray-800 font-medium text-sm">{currentPuzzle.words[selectedWord].clue}</div>
                  <div className="text-xs text-gray-500 mt-1">{currentPuzzle.words[selectedWord].word.length} letters</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Across */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1 text-sm">
                    <span className="text-blue-500">→</span> Across
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                    {acrossWords.map((word) => {
                      const wordIndex = currentPuzzle.words.indexOf(word);
                      return (
                        <div
                          key={wordIndex}
                          className={`cursor-pointer p-1.5 rounded transition-colors ${
                            selectedWord === wordIndex ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => selectWord(wordIndex)}
                        >
                          <strong>{wordIndex + 1}.</strong> {word.clue}
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Down */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1 text-sm">
                    <span className="text-green-500">↓</span> Down
                  </h4>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto text-xs">
                    {downWords.map((word) => {
                      const wordIndex = currentPuzzle.words.indexOf(word);
                      return (
                        <div
                          key={wordIndex}
                          className={`cursor-pointer p-1.5 rounded transition-colors ${
                            selectedWord === wordIndex ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'
                          }`}
                          onClick={() => selectWord(wordIndex)}
                        >
                          <strong>{wordIndex + 1}.</strong> {word.clue}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* How to Play */}
          <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📖</span> How to Play
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">1</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Click a Cell</div>
                  <div className="text-gray-600">Select any white cell to start typing</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">2</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Read the Clue</div>
                  <div className="text-gray-600">Use the clue to guess the word</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Type Letters</div>
                  <div className="text-gray-600">Enter one letter per cell</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-indigo-600 font-bold">4</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Check Your Work</div>
                  <div className="text-gray-600">Click Check to verify answers</div>
                </div>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Crossword Puzzles: The Classic Word Game</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Crossword puzzles have captivated word enthusiasts for over a century. The first known crossword puzzle
              was created by journalist Arthur Wynne and published in the New York World on December 21, 1913. Since then,
              crosswords have become one of the most popular word games worldwide, appearing in newspapers, magazines, and
              now online platforms. They offer an engaging way to expand vocabulary, improve spelling, and exercise cognitive skills.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                <h3 className="font-semibold text-indigo-800 mb-2">📚 Vocabulary Building</h3>
                <p className="text-sm text-gray-600">Crosswords expose you to new words and reinforce your existing vocabulary through contextual clues.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2">🧠 Cognitive Exercise</h3>
                <p className="text-sm text-gray-600">Solving crosswords engages memory, reasoning, and problem-solving skills simultaneously.</p>
              </div>
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">🔤 Pattern Recognition</h3>
                <p className="text-sm text-gray-600">Intersecting words help you deduce answers by recognizing letter patterns.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">📖 General Knowledge</h3>
                <p className="text-sm text-gray-600">Crossword clues often cover trivia, history, science, and culture.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">Health Benefits of Crossword Puzzles</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Research suggests that regularly solving crossword puzzles may help maintain cognitive function as we age.
                Studies have shown that people who engage in word puzzles tend to have better memory, faster mental processing,
                and may reduce their risk of cognitive decline. Crosswords are recommended by many health professionals as
                part of a mentally active lifestyle.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">Solving Strategies</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-indigo-500">•</span>
                  <span>Start with fill-in-the-blank clues - they&apos;re often the easiest</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Look for short words first (3-4 letters) to build a foundation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Use crossing letters to verify your answers and find new ones</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Think about wordplay - clues often contain puns or double meanings</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Mobile MREC2 - Before FAQs */}


          <GameAppMobileMrec2 />



          {/* FAQs Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <FirebaseFAQs pageId="crossword" fallbackFaqs={fallbackFaqs} />
          </div>
        </div>
{/* Right Sidebar - 320px */}
          <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Stats Card - Desktop Only */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Game Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-xl">
                <span className="text-gray-600 font-medium">Time</span>
                <span className="text-2xl font-bold text-indigo-600">{timeSpent}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-3 bg-green-50 rounded-xl">
                  <div className="text-xs text-gray-500">Correct</div>
                  <div className="text-xl font-bold text-green-600">{correctCells}</div>
                </div>
                <div className="text-center p-3 bg-purple-50 rounded-xl">
                  <div className="text-xs text-gray-500">Filled</div>
                  <div className="text-xl font-bold text-purple-600">{completedCells}</div>
                </div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-xl">
                <div className="text-xs text-gray-500">Total Cells</div>
                <div className="text-xl font-bold text-gray-700">{totalCells}</div>
              </div>
            </div>
          </div>

          {/* Current Clue - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Current Clue</h3>
            {selectedWord !== null ? (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                    selectedDirection === 'across' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {selectedDirection === 'across' ? '→ ACROSS' : '↓ DOWN'}
                  </span>
                  <span className="text-xs text-gray-500">#{selectedWord + 1}</span>
                </div>
                <div className="text-gray-800 font-medium">{currentPuzzle.words[selectedWord].clue}</div>
                <div className="mt-2 text-sm text-gray-500">
                  {currentPuzzle.words[selectedWord].word.length} letters
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-400 py-6 text-sm">
                Click a numbered cell to see its clue
              </div>
            )}
          </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

          {/* Clues Panel - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">All Clues</h3>

            {/* Across */}
            <div className="mb-4">
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1 text-sm">
                <span className="w-5 h-5 rounded bg-blue-100 flex items-center justify-center text-blue-600 text-xs">→</span>
                Across
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto text-sm pr-1">
                {acrossWords.map((word) => {
                  const wordIndex = currentPuzzle.words.indexOf(word);
                  return (
                    <div
                      key={wordIndex}
                      className={`cursor-pointer p-2 rounded-lg transition-colors ${
                        selectedWord === wordIndex ? 'bg-blue-100 text-blue-800' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectWord(wordIndex)}
                    >
                      <strong className="text-blue-600">{wordIndex + 1}.</strong> {word.clue}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Down */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-2 flex items-center gap-1 text-sm">
                <span className="w-5 h-5 rounded bg-green-100 flex items-center justify-center text-green-600 text-xs">↓</span>
                Down
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto text-sm pr-1">
                {downWords.map((word) => {
                  const wordIndex = currentPuzzle.words.indexOf(word);
                  return (
                    <div
                      key={wordIndex}
                      className={`cursor-pointer p-2 rounded-lg transition-colors ${
                        selectedWord === wordIndex ? 'bg-green-100 text-green-800' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => selectWord(wordIndex)}
                    >
                      <strong className="text-green-600">{wordIndex + 1}.</strong> {word.clue}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Ad Banner */}
          {/* Ad banner replaced with MREC components */}

          {/* Your Stats */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Your Record</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Puzzles Solved</span>
                <span className="font-bold text-indigo-600">{stats.completed}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Best Time</span>
                <span className="font-bold text-green-600">{stats.bestTime ? formatTime(stats.bestTime) : '--:--'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Words Found</span>
                <span className="font-bold text-purple-600">{stats.totalWords}</span>
              </div>
            </div>
          </div>

          {/* More Games */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">More Word Games</h3>
            <div className="space-y-2">
              <Link href="/us/tools/games/word-scramble" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-teal-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🔤</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Word Scramble</div>
                  <div className="text-xs text-gray-500">Unscramble the letters</div>
                </div>
              </Link>
              <Link href="/us/tools/games/hangman" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🎯</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Hangman</div>
                  <div className="text-xs text-gray-500">Guess the hidden word</div>
                </div>
              </Link>
              <Link href="/us/tools/games/typing-speed" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">⌨️</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Typing Speed</div>
                  <div className="text-xs text-gray-500">Test your typing</div>
                </div>
              </Link>
            </div>
            <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-indigo-600 hover:text-indigo-700 font-medium">
              View All Games →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
