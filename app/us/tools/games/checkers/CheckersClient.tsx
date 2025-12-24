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
    question: 'How do you play checkers online?',
    answer: 'You play as red pieces and move first. Click a piece to select it, then click a highlighted green square to move. Pieces move diagonally forward on dark squares only. Jump over opponent pieces to capture them.',
    order: 1
  },
  {
    id: '2',
    question: 'What are the rules for jumping in checkers?',
    answer: 'When an opponent\'s piece is diagonally adjacent with an empty square beyond it, you must jump over it to capture. Multiple jumps in one turn are allowed and sometimes required. If you can jump, you must!',
    order: 2
  },
  {
    id: '3',
    question: 'How do pieces become kings?',
    answer: 'When a piece reaches the opposite end of the board (row 0 for red, row 7 for black), it becomes a king. Kings are marked with a crown and can move and jump both forward and backward diagonally.',
    order: 3
  },
  {
    id: '4',
    question: 'How do you win at checkers?',
    answer: 'You win by either capturing all opponent pieces or blocking all their possible moves. The game ends immediately when one player cannot make a legal move.',
    order: 4
  },
  {
    id: '5',
    question: 'What difficulty levels are available?',
    answer: 'Three AI levels: Easy (random moves with jump preference), Normal (basic strategy evaluating piece values and position), and Hard (deeper move analysis and strategic planning).',
    order: 5
  },
  {
    id: '6',
    question: 'Can regular pieces move backwards?',
    answer: 'No, regular pieces can only move forward diagonally. Only kings can move in any diagonal direction. This is why getting pieces kinged is strategically important.',
    order: 6
  }
];

interface Piece {
  color: 'red' | 'black';
  king: boolean;
}

interface Square {
  row: number;
  col: number;
}

interface Move extends Square {
  jumpedRow?: number;
  jumpedCol?: number;
  chain?: Move[];
}

interface ComputerMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  isJump: boolean;
  piece: Piece;
}

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface CheckersClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

export default function CheckersClient({ relatedGames = defaultRelatedGames }: CheckersClientProps) {
  const [board, setBoard] = useState<(Piece | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('checkers');

  const webAppSchema = generateWebAppSchema({
    name: 'Play Checkers Online - Free Checkers Game vs Computer',
    description: 'Play checkers online for free against AI. Three difficulty levels, king pieces, and multiple jump captures. Classic strategy board game for all ages.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/checkers',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [mustJump, setMustJump] = useState(false);
  const [moveHistory, setMoveHistory] = useState<string[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(2);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<'red_wins' | 'black_wins' | null>(null);

  // Initialize board
  const initializeBoard = useCallback(() => {
    const newBoard: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));

    // Place black pieces (rows 0-2)
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { color: 'black', king: false };
        }
      }
    }

    // Place red pieces (rows 5-7)
    for (let row = 5; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        if ((row + col) % 2 === 1) {
          newBoard[row][col] = { color: 'red', king: false };
        }
      }
    }

    setBoard(newBoard);
    setCurrentPlayer('red');
    setSelectedSquare(null);
    setValidMoves([]);
    setMustJump(false);
    setMoveHistory([]);
    setGameOver(false);
    setShowModal(false);
    setGameResult(null);
  }, []);

  // Initialize on mount
  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  // Count pieces
  const countPieces = useCallback((color: 'red' | 'black') => {
    let count = 0;
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = board[row]?.[col];
        if (piece && piece.color === color) {
          count++;
        }
      }
    }
    return count;
  }, [board]);

  // Get move directions
  const getMoveDirections = (piece: Piece): [number, number][] => {
    if (piece.king) {
      return [[-1, -1], [-1, 1], [1, -1], [1, 1]];
    } else if (piece.color === 'red') {
      return [[-1, -1], [-1, 1]]; // Red moves up
    } else {
      return [[1, -1], [1, 1]]; // Black moves down
    }
  };

  // Check if square is valid
  const isValidSquare = (row: number, col: number): boolean => {
    return row >= 0 && row < 8 && col >= 0 && col < 8;
  };

  // Get jump moves
  const getJumpMoves = useCallback((row: number, col: number, piece: Piece, boardState: (Piece | null)[][], visited: Set<string> = new Set()): Move[] => {
    const jumps: Move[] = [];
    const directions = getMoveDirections(piece);
    const key = `${row},${col}`;

    if (visited.has(key)) return [];
    visited.add(key);

    directions.forEach(([dr, dc]) => {
      const jumpOverRow = row + dr;
      const jumpOverCol = col + dc;
      const landRow = row + 2 * dr;
      const landCol = col + 2 * dc;

      if (isValidSquare(landRow, landCol) &&
          boardState[jumpOverRow] && boardState[jumpOverRow][jumpOverCol] &&
          boardState[jumpOverRow][jumpOverCol]!.color !== piece.color &&
          !boardState[landRow][landCol]) {

        jumps.push({
          row: landRow,
          col: landCol,
          jumpedRow: jumpOverRow,
          jumpedCol: jumpOverCol
        });

        // Check for multiple jumps
        const tempPiece = boardState[jumpOverRow][jumpOverCol];
        boardState[jumpOverRow][jumpOverCol] = null;
        boardState[landRow][landCol] = piece;
        boardState[row][col] = null;

        const moreJumps = getJumpMoves(landRow, landCol, piece, boardState, new Set(visited));
        moreJumps.forEach(jump => {
          jumps.push({
            ...jump,
            chain: [{ row: landRow, col: landCol, jumpedRow: jumpOverRow, jumpedCol: jumpOverCol }, ...(jump.chain || [])]
          });
        });

        // Restore board
        boardState[row][col] = piece;
        boardState[landRow][landCol] = null;
        boardState[jumpOverRow][jumpOverCol] = tempPiece;
      }
    });

    return jumps;
  }, []);

  // Get regular moves
  const getRegularMoves = (row: number, col: number, piece: Piece, boardState: (Piece | null)[][]): Move[] => {
    const moves: Move[] = [];
    const directions = getMoveDirections(piece);

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (isValidSquare(newRow, newCol) && !boardState[newRow][newCol]) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  };

  // Get valid moves
  const getValidMovesForPiece = useCallback((row: number, col: number, boardState: (Piece | null)[][]): { moves: Move[], mustJump: boolean } => {
    const piece = boardState[row][col];
    if (!piece) return { moves: [], mustJump: false };

    // Check for jumps first
    const jumps = getJumpMoves(row, col, piece, boardState);
    if (jumps.length > 0) {
      return { moves: jumps, mustJump: true };
    }

    // If no jumps, check regular moves
    return { moves: getRegularMoves(row, col, piece, boardState), mustJump: false };
  }, [getJumpMoves]);

  // Get all valid moves for a color
  const getAllValidMoves = useCallback((color: 'red' | 'black', boardState: (Piece | null)[][]): ComputerMove[] => {
    const moves: ComputerMove[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece && piece.color === color) {
          const { moves: validMoves } = getValidMovesForPiece(row, col, boardState);
          validMoves.forEach(move => {
            moves.push({
              fromRow: row,
              fromCol: col,
              toRow: move.row,
              toCol: move.col,
              isJump: move.jumpedRow !== undefined,
              piece: piece
            });
          });
        }
      }
    }

    return moves;
  }, [getValidMovesForPiece]);

  // Check game over
  const checkGameOver = useCallback((boardState: (Piece | null)[][], player: 'red' | 'black'): 'red_wins' | 'black_wins' | null => {
    let redCount = 0;
    let blackCount = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (piece) {
          if (piece.color === 'red') redCount++;
          else blackCount++;
        }
      }
    }

    if (redCount === 0) return 'black_wins';
    if (blackCount === 0) return 'red_wins';

    // Check if current player has no valid moves
    const validMoves = getAllValidMoves(player, boardState);
    if (validMoves.length === 0) {
      return player === 'red' ? 'black_wins' : 'red_wins';
    }

    return null;
  }, [getAllValidMoves]);

  // Evaluate position
  const evaluatePosition = (color: 'red' | 'black', boardState: (Piece | null)[][]): number => {
    let score = 0;

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = boardState[row][col];
        if (!piece) continue;

        const pieceValue = piece.king ? 5 : 3;

        if (piece.color === color) {
          score += pieceValue;
        } else {
          score -= pieceValue;
        }
      }
    }

    return score;
  };

  // Evaluate move
  const evaluateMove = (move: ComputerMove, depth: number, boardState: (Piece | null)[][]): number => {
    // Simulate move
    const newBoard = boardState.map(row => [...row]);
    const fromPiece = newBoard[move.fromRow][move.fromCol];
    newBoard[move.toRow][move.toCol] = fromPiece;
    newBoard[move.fromRow][move.fromCol] = null;

    let capturedPiece: Piece | null = null;
    if (move.isJump) {
      const midRow = Math.floor((move.fromRow + move.toRow) / 2);
      const midCol = Math.floor((move.fromCol + move.toCol) / 2);
      capturedPiece = newBoard[midRow][midCol];
      newBoard[midRow][midCol] = null;
    }

    // Calculate score
    let score = evaluatePosition('black', newBoard);

    // Bonus for captures
    if (move.isJump) score += 15;

    // Bonus for king promotion
    if (fromPiece && !fromPiece.king && move.toRow === 7) score += 10;

    // Bonus for advancing pieces
    if (fromPiece && !fromPiece.king) {
      score += move.toRow * 0.5;
    }

    // Bonus for center control
    const centerDistance = Math.abs(3.5 - move.toRow) + Math.abs(3.5 - move.toCol);
    score += (7 - centerDistance) * 0.3;

    // Look ahead if depth > 0
    if (depth > 0) {
      const opponentMoves = getAllValidMoves('red', newBoard);
      if (opponentMoves.length > 0) {
        let worstResponse = Infinity;

        // Only evaluate a sample of opponent moves to save time
        const samplesToCheck = Math.min(5, opponentMoves.length);
        for (let i = 0; i < samplesToCheck; i++) {
          const opponentMove = opponentMoves[i];
          const responseScore = evaluateMove(opponentMove, depth - 1, newBoard);
          worstResponse = Math.min(worstResponse, -responseScore);
        }

        score += worstResponse * 0.7;
      }
    }

    return score;
  };

  // Choose best move
  const chooseBestMove = (moves: ComputerMove[], depth: number, boardState: (Piece | null)[][]): ComputerMove => {
    let bestMove = moves[0];
    let bestScore = -Infinity;

    for (const move of moves) {
      const score = evaluateMove(move, depth, boardState);

      // Add small random factor for variety
      const randomFactor = Math.random() * 0.5;
      const totalScore = score + randomFactor;

      if (totalScore > bestScore) {
        bestScore = totalScore;
        bestMove = move;
      }
    }

    return bestMove;
  };

  // Make move
  const makeMove = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number, isComputerMove = false) => {
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(row => [...row]);
      const piece = newBoard[fromRow][fromCol];
      if (!piece) return prevBoard;

      const move = validMoves.find(m => m.row === toRow && m.col === toCol);
      if (!move && !isComputerMove) return prevBoard;

      // Move piece
      newBoard[toRow][toCol] = piece;
      newBoard[fromRow][fromCol] = null;

      let moveDesc = `${currentPlayer}: ${fromRow},${fromCol} → ${toRow},${toCol}`;
      let captured = false;

      // Handle jump
      if (move && move.jumpedRow !== undefined && move.jumpedCol !== undefined) {
        newBoard[move.jumpedRow][move.jumpedCol] = null;
        moveDesc += ' (jump)';
        captured = true;

        // Check for additional jumps
        const { moves: moreJumps, mustJump: hasMoreJumps } = getValidMovesForPiece(toRow, toCol, newBoard);
        if (hasMoreJumps && moreJumps.length > 0) {
          setSelectedSquare({ row: toRow, col: toCol });
          setValidMoves(moreJumps);
          setMustJump(true);
          return newBoard; // Don't switch players yet
        }
      }

      // Check for king promotion
      if (!piece.king) {
        if ((piece.color === 'red' && toRow === 0) ||
            (piece.color === 'black' && toRow === 7)) {
          piece.king = true;
          moveDesc += ' (crowned)';
        }
      }

      setMoveHistory(prev => [...prev, moveDesc]);

      // Switch players
      setSelectedSquare(null);
      setValidMoves([]);
      setMustJump(false);
      const nextPlayer = currentPlayer === 'red' ? 'black' : 'red';
      setCurrentPlayer(nextPlayer);

      // Check game over
      const result = checkGameOver(newBoard, nextPlayer);
      if (result) {
        setGameOver(true);
        setGameResult(result);
        setShowModal(true);
        return newBoard;
      }

      // Computer move
      if (nextPlayer === 'black' && !isComputerMove) {
        setTimeout(() => {
          const allMoves = getAllValidMoves('black', newBoard);
          if (allMoves.length === 0) {
            setGameOver(true);
            setGameResult('red_wins');
            setShowModal(true);
            return;
          }

          let computerMove: ComputerMove;

          // AI based on difficulty level
          if (difficulty === 1) {
            // Easy: Random moves, prefer jumps
            const jumps = allMoves.filter(m => m.isJump);
            computerMove = jumps.length > 0 ?
              jumps[Math.floor(Math.random() * jumps.length)] :
              allMoves[Math.floor(Math.random() * allMoves.length)];
          } else if (difficulty === 2) {
            // Normal: Evaluate moves with simple heuristics
            computerMove = chooseBestMove(allMoves, 1, newBoard);
          } else {
            // Hard: Deeper evaluation
            computerMove = chooseBestMove(allMoves, 2, newBoard);
          }

          // Execute computer move
          setBoard(computerBoard => {
            const nextBoard = computerBoard.map(row => [...row]);
            const compPiece = nextBoard[computerMove.fromRow][computerMove.fromCol];
            if (!compPiece) return computerBoard;

            nextBoard[computerMove.toRow][computerMove.toCol] = compPiece;
            nextBoard[computerMove.fromRow][computerMove.fromCol] = null;

            let compMoveDesc = `black: ${computerMove.fromRow},${computerMove.fromCol} → ${computerMove.toRow},${computerMove.toCol}`;

            if (computerMove.isJump) {
              const midRow = Math.floor((computerMove.fromRow + computerMove.toRow) / 2);
              const midCol = Math.floor((computerMove.fromCol + computerMove.toCol) / 2);
              nextBoard[midRow][midCol] = null;
              compMoveDesc += ' (jump)';
            }

            // Check for king promotion
            if (!compPiece.king && computerMove.toRow === 7) {
              compPiece.king = true;
              compMoveDesc += ' (crowned)';
            }

            setMoveHistory(prev => [...prev, compMoveDesc]);
            setCurrentPlayer('red');

            // Check game over after computer move
            const compResult = checkGameOver(nextBoard, 'red');
            if (compResult) {
              setGameOver(true);
              setGameResult(compResult);
              setShowModal(true);
            }

            return nextBoard;
          });
        }, 1000);
      }

      return newBoard;
    });
  }, [currentPlayer, validMoves, getValidMovesForPiece, checkGameOver, getAllValidMoves, difficulty]);

  // Handle square click
  const handleSquareClick = (row: number, col: number) => {
    if (gameOver || currentPlayer === 'black') return;

    const piece = board[row]?.[col];

    if (selectedSquare) {
      // Try to move to this square
      const isValid = validMoves.some(move => move.row === row && move.col === col);
      if (isValid) {
        makeMove(selectedSquare.row, selectedSquare.col, row, col);
      } else if (piece && piece.color === currentPlayer && !mustJump) {
        // Select different piece (only if not forced to jump)
        const { moves, mustJump: hasJump } = getValidMovesForPiece(row, col, board);
        setSelectedSquare({ row, col });
        setValidMoves(moves);
        setMustJump(hasJump);
      } else {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === currentPlayer) {
      // Select piece
      const { moves, mustJump: hasJump } = getValidMovesForPiece(row, col, board);
      setSelectedSquare({ row, col });
      setValidMoves(moves);
      setMustJump(hasJump);
    }
  };

  // Calculate stats
  const totalMoves = Math.floor(moveHistory.length / 2);
  const totalCaptures = moveHistory.filter(m => m.includes('jump')).length;
  const redCount = countPieces('red');
  const blackCount = countPieces('black');

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

    <div className="max-w-[1200px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
      {/* Header */}
      <div className="text-center mb-4 sm:mb-8">
        <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-red-100 to-gray-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-6 shadow-md">
          <span className="text-xl sm:text-2xl">⚫</span>
          <span className="text-red-600 font-semibold text-sm sm:text-base">Checkers Game</span>
        </div>

        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-600 via-gray-800 to-red-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-2">{getH1('Play Checkers Online')}</h1>

        <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
          Classic strategy board game. Capture all opponent pieces or block their moves to win!
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
        {/* Left Column: Board and Controls */}
        <div>
          {/* Game Controls */}
          <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4">
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 justify-center">
              <button
                onClick={initializeBoard}
                className="w-full sm:flex-1 sm:flex-none min-h-[52px] px-4 sm:px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all shadow-md hover:shadow-lg active:shadow-xl touch-manipulation text-base"
              >
                <span className="flex items-center gap-2 justify-center">
                  <span>🔄</span>
                  <span>New Game</span>
                </span>
              </button>

              <select
                value={difficulty}
                onChange={(e) => setDifficulty(parseInt(e.target.value))}
                className="w-full sm:flex-1 sm:flex-none min-h-[52px] px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white font-medium text-base touch-manipulation"
              >
                <option value="1">🟢 Easy</option>
                <option value="2">🟡 Normal</option>
                <option value="3">🔴 Hard</option>
              </select>

              <button
                disabled
                className="w-full sm:flex-1 sm:flex-none min-h-[52px] px-4 sm:px-6 py-3 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 active:from-orange-700 active:to-amber-700 transition-all shadow-md hover:shadow-lg active:shadow-xl touch-manipulation text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span className="flex items-center gap-2 justify-center">
                  <span>↩️</span>
                  <span>Undo</span>
                </span>
              </button>
            </div>
          </div>

          {/* Game Status */}
          <div className="bg-gradient-to-r from-red-50 to-gray-50 rounded-xl shadow-md p-4 mb-4 border-2 border-red-200">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="text-xs sm:text-sm text-red-700 font-medium mb-1">Current Turn</div>
                <div className="text-base sm:text-lg font-bold text-red-900 truncate">
                  {gameOver
                    ? 'Game Over'
                    : mustJump
                      ? `${currentPlayer === 'red' ? 'Your' : 'Computer\'s'} turn - Must jump!`
                      : `${currentPlayer === 'red' ? 'Your' : 'Computer\'s'} turn`
                  }
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <div className="text-xs sm:text-sm text-red-700 font-medium mb-1">Move #</div>
                <div className="text-xl sm:text-2xl font-bold text-red-900">{totalMoves + 1}</div>
              </div>
            </div>
          </div>

          {/* Checkers Board */}
          <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6">
            <div className="grid grid-cols-8 border-4 border-amber-950 rounded-lg overflow-hidden shadow-xl aspect-square max-w-[600px] mx-auto">
              {board.map((row, rowIndex) =>
                row.map((piece, colIndex) => {
                  const isLight = (rowIndex + colIndex) % 2 === 0;
                  const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
                  const isValidMove = validMoves.some(move => move.row === rowIndex && move.col === colIndex);

                  return (
                    <div
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleSquareClick(rowIndex, colIndex)}
                      className={`aspect-square flex items-center justify-center text-2xl sm:text-3xl cursor-pointer transition-all duration-200 touch-manipulation active:scale-95 ${
                        isLight ? 'bg-amber-100' : 'bg-amber-600'
                      } ${isSelected ? '!bg-blue-400 ring-4 ring-blue-500 ring-opacity-50' : ''} ${
                        isValidMove ? '!bg-green-400 ring-4 ring-green-500 ring-opacity-50 animate-pulse' : ''
                      } ${piece && piece.color === currentPlayer && !isLight ? 'hover:bg-yellow-300 active:bg-yellow-400 hover:shadow-lg' : ''}`}
                    >
                      {piece && !isLight && (
                        <span className="select-none pointer-events-none">
                          {piece.king
                            ? (piece.color === 'red' ? '👑' : '⚫👑')
                            : (piece.color === 'red' ? '🔴' : '⚫')
                          }
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Mobile-only Quick Stats */}
          <div className="lg:hidden mt-4 grid grid-cols-2 gap-3">
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="text-xs font-semibold text-gray-600 mb-1 text-center">Red (You)</div>
              <div className="text-2xl font-bold text-red-600 text-center">{redCount}</div>
            </div>
            <div className="bg-white rounded-xl shadow-lg p-3">
              <div className="text-xs font-semibold text-gray-600 mb-1 text-center">Black (AI)</div>
              <div className="text-2xl font-bold text-slate-800 text-center">{blackCount}</div>
            </div>
          </div>
        </div>
{/* Right Column: Sidebar */}
        <div className="space-y-4 lg:w-[320px]">
          {/* Ad Banner */}
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
<AdBanner className="w-full" />

          {/* Piece Count (Desktop only) */}
          <div className="hidden lg:block bg-white rounded-xl shadow-lg p-4">
            <h3 className="text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span>🎯</span>
              <span>Pieces Remaining</span>
            </h3>

            <div className="space-y-3">
              <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-600 mb-1">Red Pieces (You):</div>
                <div className="text-3xl font-bold text-red-600">{redCount}</div>
              </div>

              <div className="bg-gradient-to-r from-slate-700 to-slate-900 rounded-lg p-3">
                <div className="text-xs font-semibold text-gray-300 mb-1">Black Pieces (AI):</div>
                <div className="text-3xl font-bold text-white">{blackCount}</div>
              </div>
            </div>
          </div>

          {/* Game Stats */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-4 border-2 border-blue-200">
            <h3 className="text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
              <span>📊</span>
              <span>Game Stats</span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xs text-gray-600 font-medium mb-1">Total Moves</div>
                <div className="text-xl font-bold text-blue-600">{totalMoves}</div>
              </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />
              <div className="bg-white rounded-lg p-3 text-center">
                <div className="text-xs text-gray-600 font-medium mb-1">Captures</div>
                <div className="text-xl font-bold text-red-600">{totalCaptures}</div>
              </div>
            </div>
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
        </div>
      </div>

      {/* Game Over Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
          <div className="bg-gradient-to-br from-white to-red-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-md w-full text-center animate-bounce-in shadow-2xl border-4 border-red-300">
            <div className="text-6xl sm:text-7xl mb-4 animate-pulse">
              {gameResult === 'red_wins' ? '🏆' : '😔'}
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-red-600 to-gray-800 bg-clip-text text-transparent mb-3 sm:mb-4">
              {gameResult === 'red_wins' ? 'You Win!' : 'Computer Wins!'}
            </h2>
            <p className="text-base sm:text-lg text-gray-700 mb-6">
              {gameResult === 'red_wins'
                ? 'Congratulations! You defeated the computer!'
                : 'Better luck next time!'
              }
            </p>
            <div className="bg-red-100 rounded-lg p-4 mb-6 text-sm sm:text-base">
              <div className="font-semibold text-red-900">Game Statistics:</div>
              <div className="text-gray-700 mt-2 space-y-1">
                <div>Total Moves: <span className="font-bold">{totalMoves}</span></div>
                <div>Captures: <span className="font-bold">{totalCaptures}</span></div>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  initializeBoard();
                }}
                className="flex-1 min-h-[52px] px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all shadow-lg hover:shadow-xl touch-manipulation"
              >
                🔄 Play Again
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 min-h-[52px] px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl font-bold hover:from-gray-600 hover:to-gray-700 active:from-gray-700 active:to-gray-800 transition-all shadow-lg hover:shadow-xl touch-manipulation"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* How to Play */}
      <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-50 to-red-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200">
        <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
          <span>📚</span>
          <span>How to Play Checkers</span>
        </h3>
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-sm sm:text-base text-gray-700">
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-red-600 mb-3 text-base sm:text-lg flex items-center gap-2">
              <span>📋</span>
              <span>Basic Rules</span>
            </h4>
            <ul className="space-y-2.5">
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>You play as red, computer plays as black</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>Pieces move diagonally on dark squares only</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>Regular pieces can only move forward</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>Jump over opponent pieces to capture them</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>Multiple jumps in one turn are allowed</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-600 font-bold flex-shrink-0 mt-0.5">•</span>
                <span>Reach the opposite end to crown a king</span>
              </li>
            </ul>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h4 className="font-bold text-green-600 mb-3 text-base sm:text-lg flex items-center gap-2">
              <span>🏆</span>
              <span>Winning & King Pieces</span>
            </h4>
            <div className="mb-4">
              <div className="font-semibold text-gray-700 mb-2">Winning Conditions:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>Capture all opponent pieces, OR</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>Block all opponent moves</span>
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-700 mb-2">King Pieces:</div>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>Can move and jump in any diagonal direction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>Shown with a crown symbol (👑)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0 mt-0.5">•</span>
                  <span>More powerful than regular pieces</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* SEO Content Section */}
      <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Checkers: The Ancient Strategy Game</h2>
        <p className="text-gray-600 mb-6 leading-relaxed">
          Checkers, known as Draughts in Britain and many other countries, is one of the oldest strategy board games in
          the world. Archaeological evidence suggests the game dates back to around 3000 BCE, with ancient versions found
          in the city of Ur in Iraq. The modern rules were established around the 12th century in France, and the game has
          remained largely unchanged since then, testament to its perfect balance of simplicity and strategic depth.
        </p>

        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-red-50 rounded-xl p-4 border border-red-100">
            <h3 className="font-semibold text-red-800 mb-2">♔ King Promotion</h3>
            <p className="text-sm text-gray-600">When a piece reaches the opponent&apos;s back row, it becomes a king and can move in any diagonal direction.</p>
          </div>
          <div className="bg-gray-100 rounded-xl p-4 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-2">↗️ Forced Captures</h3>
            <p className="text-sm text-gray-600">If you can capture an opponent&apos;s piece, you must do so. This mandatory jump rule adds strategic complexity.</p>
          </div>
          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <h3 className="font-semibold text-amber-800 mb-2">🔄 Multiple Jumps</h3>
            <p className="text-sm text-gray-600">A single piece can capture multiple opponent pieces in one turn by making consecutive jumps.</p>
          </div>
          <div className="bg-green-50 rounded-xl p-4 border border-green-100">
            <h3 className="font-semibold text-green-800 mb-2">🎯 Diagonal Movement</h3>
            <p className="text-sm text-gray-600">All pieces move diagonally on the dark squares only, with regular pieces moving forward only.</p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-red-100 to-gray-100 rounded-xl p-5 mb-6">
          <h3 className="font-bold text-gray-800 mb-3">A Solved Game</h3>
          <p className="text-gray-700 text-sm leading-relaxed">
            In 2007, researchers at the University of Alberta solved checkers using computers, proving that with perfect
            play from both sides, the game will always end in a draw. This 18-year project analyzed 500 billion billion
            (5×10²⁰) possible board positions. Despite being &quot;solved,&quot; checkers remains engaging because humans cannot
            memorize perfect play, making every game a fresh challenge.
          </p>
        </div>

        <div className="bg-gray-50 rounded-xl p-5">
          <h3 className="font-bold text-gray-800 mb-3">Cognitive Benefits</h3>
          <ul className="space-y-2 text-gray-600 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-red-500">•</span>
              <span>Develops strategic thinking and planning ahead multiple moves</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gray-500">•</span>
              <span>Improves pattern recognition and spatial reasoning skills</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-500">•</span>
              <span>Teaches the importance of piece positioning and board control</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500">•</span>
              <span>Suitable for all ages - easy to learn but takes years to master</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile MREC2 - Before FAQs */}


      <GameAppMobileMrec2 />



      {/* FAQs Section */}
      <div className="mt-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="checkers" fallbackFaqs={fallbackFaqs} />
      </div>

      <style jsx>{`
        @keyframes bounce-in {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          50% {
            transform: scale(1.05);
          }
          70% {
            transform: scale(0.9);
          }
          100% {
            transform: scale(1);
            opacity: 1;
          }
        }

        .animate-bounce-in {
          animation: bounce-in 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }
      `}</style>
    </div>
    </>
  );
}
