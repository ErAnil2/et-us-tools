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
    question: 'How do I play chess online against the computer?',
    answer: 'Click on any white piece to select it, then click on a highlighted square to move. Green highlights show valid moves, while red highlights indicate capture opportunities. The computer will respond automatically after your move.',
    order: 1
  },
  {
    id: '2',
    question: 'What difficulty levels are available?',
    answer: 'There are three AI difficulty levels: Easy (random moves, good for beginners), Medium (basic strategy with capture preference), and Hard (evaluates positions and plans moves strategically).',
    order: 2
  },
  {
    id: '3',
    question: 'How do the chess pieces move?',
    answer: 'Pawns move forward one square (two from start) and capture diagonally. Rooks move horizontally/vertically. Bishops move diagonally. Knights move in an L-shape. Queens move in any direction. Kings move one square in any direction.',
    order: 3
  },
  {
    id: '4',
    question: 'What is the objective of chess?',
    answer: 'The goal is to checkmate your opponent\'s king, meaning the king is under attack and has no legal moves to escape. You can also win if your opponent resigns or runs out of time in timed games.',
    order: 4
  },
  {
    id: '5',
    question: 'Can I get hints during the game?',
    answer: 'Yes! Click the Hint button to see a suggested move. The AI will highlight a recommended piece and its best destination. The hint disappears after 2 seconds so you can continue playing.',
    order: 5
  },
  {
    id: '6',
    question: 'What happens if I make an illegal move?',
    answer: 'The game only allows legal moves. When you select a piece, only valid destination squares are highlighted. If you click an invalid square, nothing happens. This helps you learn proper chess rules.',
    order: 6
  }
];

interface Piece {
  color: 'white' | 'black';
  type: 'king' | 'queen' | 'rook' | 'bishop' | 'knight' | 'pawn';
  moved: boolean;
}

interface Move {
  row: number;
  col: number;
}

interface MoveHistory {
  number: number;
  player: 'white' | 'black';
  notation: string;
}

interface LastMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

interface GameMove {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  piece: Piece;
}

interface RelatedGame {
  href: string;
  title: string;
  description: string;
  color: string;
  icon: string;
}

interface ChessClientProps {
  relatedGames?: RelatedGame[];
}

const defaultRelatedGames: RelatedGame[] = [
  { href: '/us/tools/games/memory-cards', title: 'Memory Cards', description: 'Test your memory', color: 'bg-blue-500', icon: '🎴' },
  { href: '/us/tools/games/tic-tac-toe', title: 'Tic Tac Toe', description: 'Classic game', color: 'bg-green-500', icon: '⭕' },
  { href: '/us/tools/games/snake-game', title: 'Snake Game', description: 'Classic snake', color: 'bg-purple-500', icon: '🐍' },
];

export default function ChessClient({ relatedGames = defaultRelatedGames }: ChessClientProps) {
  const [board, setBoard] = useState<(Piece | null)[][]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');

  const { getH1, getSubHeading, getFaqs, faqSchema } = usePageSEO('chess');

  const webAppSchema = generateWebAppSchema({
    name: 'Play Chess Online - Free Chess Game vs Computer',
    description: 'Play chess online for free against AI. Three difficulty levels, move hints, and captured piece tracking. Learn and master the classic strategy game.',
    url: 'https://economictimes.indiatimes.com/us/tools/games/chess',
    applicationCategory: 'Game',
    operatingSystem: 'Any'
  });
  const [selectedSquare, setSelectedSquare] = useState<{ row: number; col: number } | null>(null);
  const [validMoves, setValidMoves] = useState<Move[]>([]);
  const [moveHistory, setMoveHistory] = useState<MoveHistory[]>([]);
  const [capturedWhite, setCapturedWhite] = useState<Piece[]>([]);
  const [capturedBlack, setCapturedBlack] = useState<Piece[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [difficulty, setDifficulty] = useState(2);
  const [moveCount, setMoveCount] = useState(0);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [gameResult, setGameResult] = useState<string>('');

  const pieceSymbols = {
    white: { king: '♔', queen: '♕', rook: '♖', bishop: '♗', knight: '♘', pawn: '♙' },
    black: { king: '♚', queen: '♛', rook: '♜', bishop: '♝', knight: '♞', pawn: '♟' }
  };

  const pieceValues = {
    pawn: 1,
    knight: 3,
    bishop: 3,
    rook: 5,
    queen: 9,
    king: 0
  };

  const initializeBoard = useCallback(() => {
    const newBoard: (Piece | null)[][] = Array(8).fill(null).map(() => Array(8).fill(null));
    const backRank: ('rook' | 'knight' | 'bishop' | 'queen' | 'king')[] = ['rook', 'knight', 'bishop', 'queen', 'king', 'bishop', 'knight', 'rook'];

    // Black pieces (top)
    for (let i = 0; i < 8; i++) {
      newBoard[0][i] = { color: 'black', type: backRank[i], moved: false };
      newBoard[1][i] = { color: 'black', type: 'pawn', moved: false };
    }

    // White pieces (bottom)
    for (let i = 0; i < 8; i++) {
      newBoard[6][i] = { color: 'white', type: 'pawn', moved: false };
      newBoard[7][i] = { color: 'white', type: backRank[i], moved: false };
    }

    setBoard(newBoard);
    setCurrentPlayer('white');
    setSelectedSquare(null);
    setValidMoves([]);
    setMoveHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setGameOver(false);
    setMoveCount(0);
    setLastMove(null);
    setShowModal(false);
  }, []);

  useEffect(() => {
    initializeBoard();
  }, [initializeBoard]);

  const getPawnMoves = useCallback((row: number, col: number, color: 'white' | 'black', currentBoard: (Piece | null)[][]): Move[] => {
    const moves: Move[] = [];
    const direction = color === 'white' ? -1 : 1;
    const startRow = color === 'white' ? 6 : 1;

    // Forward move
    if (row + direction >= 0 && row + direction < 8 && !currentBoard[row + direction][col]) {
      moves.push({ row: row + direction, col });

      // Double move from start position
      if (row === startRow && !currentBoard[row + 2 * direction][col]) {
        moves.push({ row: row + 2 * direction, col });
      }
    }

    // Captures
    [-1, 1].forEach(dc => {
      const newCol = col + dc;
      if (newCol >= 0 && newCol < 8 && row + direction >= 0 && row + direction < 8) {
        const targetPiece = currentBoard[row + direction][newCol];
        if (targetPiece && targetPiece.color !== color) {
          moves.push({ row: row + direction, col: newCol });
        }
      }
    });

    return moves;
  }, []);

  const getRookMoves = useCallback((row: number, col: number, currentBoard: (Piece | null)[][]): Move[] => {
    const moves: Move[] = [];
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const piece = currentBoard[newRow][newCol];
        if (!piece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (piece.color !== currentBoard[row][col]?.color) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }
      }
    });

    return moves;
  }, []);

  const getBishopMoves = useCallback((row: number, col: number, currentBoard: (Piece | null)[][]): Move[] => {
    const moves: Move[] = [];
    const directions = [[-1, -1], [-1, 1], [1, -1], [1, 1]];

    directions.forEach(([dr, dc]) => {
      for (let i = 1; i < 8; i++) {
        const newRow = row + dr * i;
        const newCol = col + dc * i;

        if (newRow < 0 || newRow >= 8 || newCol < 0 || newCol >= 8) break;

        const piece = currentBoard[newRow][newCol];
        if (!piece) {
          moves.push({ row: newRow, col: newCol });
        } else {
          if (piece.color !== currentBoard[row][col]?.color) {
            moves.push({ row: newRow, col: newCol });
          }
          break;
        }
      }
    });

    return moves;
  }, []);

  const getKnightMoves = useCallback((row: number, col: number): Move[] => {
    const moves: Move[] = [];
    const knightMoves = [[-2, -1], [-2, 1], [-1, -2], [-1, 2], [1, -2], [1, 2], [2, -1], [2, 1]];

    knightMoves.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  }, []);

  const getKingMoves = useCallback((row: number, col: number): Move[] => {
    const moves: Move[] = [];
    const directions = [[-1, -1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, -1], [1, 0], [1, 1]];

    directions.forEach(([dr, dc]) => {
      const newRow = row + dr;
      const newCol = col + dc;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        moves.push({ row: newRow, col: newCol });
      }
    });

    return moves;
  }, []);

  const getValidMoves = useCallback((row: number, col: number, currentBoard: (Piece | null)[][]): Move[] => {
    const piece = currentBoard[row][col];
    if (!piece) return [];

    let moves: Move[] = [];

    switch (piece.type) {
      case 'pawn':
        moves = getPawnMoves(row, col, piece.color, currentBoard);
        break;
      case 'rook':
        moves = getRookMoves(row, col, currentBoard);
        break;
      case 'bishop':
        moves = getBishopMoves(row, col, currentBoard);
        break;
      case 'knight':
        moves = getKnightMoves(row, col);
        break;
      case 'queen':
        moves = [...getRookMoves(row, col, currentBoard), ...getBishopMoves(row, col, currentBoard)];
        break;
      case 'king':
        moves = getKingMoves(row, col);
        break;
    }

    return moves.filter(move => {
      const targetPiece = currentBoard[move.row][move.col];
      return !targetPiece || targetPiece.color !== piece.color;
    });
  }, [getPawnMoves, getRookMoves, getBishopMoves, getKnightMoves, getKingMoves]);

  const getMoveNotation = useCallback((piece: Piece, fromRow: number, fromCol: number, toRow: number, toCol: number, captured: Piece | null): string => {
    const files = 'abcdefgh';
    const ranks = '87654321';

    const pieceSymbol = piece.type === 'pawn' ? '' : pieceSymbols[piece.color][piece.type];
    const capture = captured ? 'x' : '';
    const to = files[toCol] + ranks[toRow];

    return `${pieceSymbol}${capture}${to}`;
  }, [pieceSymbols]);

  const findKing = useCallback((color: 'white' | 'black', currentBoard: (Piece | null)[][]): { row: number; col: number } | null => {
    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece && piece.color === color && piece.type === 'king') {
          return { row, col };
        }
      }
    }
    return null;
  }, []);

  const getAllValidMoves = useCallback((color: 'white' | 'black', currentBoard: (Piece | null)[][]): GameMove[] => {
    const moves: GameMove[] = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 8; col++) {
        const piece = currentBoard[row][col];
        if (piece && piece.color === color) {
          const validMoves = getValidMoves(row, col, currentBoard);
          validMoves.forEach(move => {
            moves.push({
              fromRow: row,
              fromCol: col,
              toRow: move.row,
              toCol: move.col,
              piece: piece
            });
          });
        }
      }
    }

    return moves;
  }, [getValidMoves]);

  const getBestMove = useCallback((moves: GameMove[], currentBoard: (Piece | null)[][]): GameMove => {
    let bestScore = -Infinity;
    let bestMoves: GameMove[] = [];

    moves.forEach(move => {
      let score = 0;

      // Score for captures
      const capturedPiece = currentBoard[move.toRow][move.toCol];
      if (capturedPiece) {
        score += pieceValues[capturedPiece.type] * 10;
      }

      // Score for center control
      const centerDistance = Math.abs(move.toRow - 3.5) + Math.abs(move.toCol - 3.5);
      score += (7 - centerDistance) * 2;

      // Score for piece development
      if (move.piece.type === 'knight' || move.piece.type === 'bishop') {
        score += 5;
      }

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    });

    return bestMoves[Math.floor(Math.random() * bestMoves.length)];
  }, [pieceValues]);

  const endGame = useCallback((result: string) => {
    setGameOver(true);
    setGameResult(result);
    setShowModal(true);
  }, []);

  const checkGameOver = useCallback((currentBoard: (Piece | null)[][], player: 'white' | 'black') => {
    const whiteKing = findKing('white', currentBoard);
    const blackKing = findKing('black', currentBoard);

    if (!whiteKing) {
      endGame('black_wins');
      return true;
    } else if (!blackKing) {
      endGame('white_wins');
      return true;
    } else if (getAllValidMoves(player, currentBoard).length === 0) {
      endGame('stalemate');
      return true;
    }
    return false;
  }, [findKing, getAllValidMoves, endGame]);

  const makeMove = useCallback((fromRow: number, fromCol: number, toRow: number, toCol: number) => {
    const newBoard = board.map(row => [...row]);
    const piece = newBoard[fromRow][fromCol];
    const capturedPiece = newBoard[toRow][toCol];

    if (!piece) return;

    // Handle capture
    if (capturedPiece) {
      if (capturedPiece.color === 'white') {
        setCapturedWhite(prev => [...prev, capturedPiece]);
      } else {
        setCapturedBlack(prev => [...prev, capturedPiece]);
      }
    }

    // Move piece
    newBoard[toRow][toCol] = { ...piece, moved: true };
    newBoard[fromRow][fromCol] = null;

    // Store last move for highlighting
    setLastMove({
      from: { row: fromRow, col: fromCol },
      to: { row: toRow, col: toCol }
    });

    // Record move
    const newMoveCount = moveCount + 1;
    setMoveCount(newMoveCount);
    const moveNotation = getMoveNotation(piece, fromRow, fromCol, toRow, toCol, capturedPiece);
    setMoveHistory(prev => [...prev, {
      number: Math.ceil(newMoveCount / 2),
      player: currentPlayer,
      notation: moveNotation
    }]);

    // Switch player
    const nextPlayer = currentPlayer === 'white' ? 'black' : 'white';
    setCurrentPlayer(nextPlayer);

    setBoard(newBoard);

    // Check for game over conditions
    if (!checkGameOver(newBoard, nextPlayer)) {
      // If it's black's turn and game is not over, make computer move
      if (nextPlayer === 'black') {
        setTimeout(() => {
          makeComputerMove(newBoard, newMoveCount);
        }, 500);
      }
    }
  }, [board, currentPlayer, moveCount, getMoveNotation, checkGameOver]);

  const makeComputerMove = useCallback((currentBoard: (Piece | null)[][], currentMoveCount: number) => {
    const allMoves = getAllValidMoves('black', currentBoard);
    if (allMoves.length === 0) {
      endGame('stalemate');
      return;
    }

    let selectedMove: GameMove;

    // AI strategy based on difficulty
    if (difficulty === 1) {
      // Easy: Random move
      selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
    } else if (difficulty === 2) {
      // Medium: Prefer captures and high-value pieces
      const captures = allMoves.filter(move => currentBoard[move.toRow][move.toCol]);
      if (captures.length > 0 && Math.random() > 0.3) {
        selectedMove = captures[Math.floor(Math.random() * captures.length)];
      } else {
        selectedMove = allMoves[Math.floor(Math.random() * allMoves.length)];
      }
    } else {
      // Hard: Evaluate positions and choose best move
      selectedMove = getBestMove(allMoves, currentBoard);
    }

    const newBoard = currentBoard.map(row => [...row]);
    const piece = newBoard[selectedMove.fromRow][selectedMove.fromCol];
    const capturedPiece = newBoard[selectedMove.toRow][selectedMove.toCol];

    if (!piece) return;

    // Handle capture
    if (capturedPiece) {
      if (capturedPiece.color === 'white') {
        setCapturedWhite(prev => [...prev, capturedPiece]);
      } else {
        setCapturedBlack(prev => [...prev, capturedPiece]);
      }
    }

    // Move piece
    newBoard[selectedMove.toRow][selectedMove.toCol] = { ...piece, moved: true };
    newBoard[selectedMove.fromRow][selectedMove.fromCol] = null;

    // Store last move for highlighting
    setLastMove({
      from: { row: selectedMove.fromRow, col: selectedMove.fromCol },
      to: { row: selectedMove.toRow, col: selectedMove.toCol }
    });

    // Record move
    const newMoveCount = currentMoveCount + 1;
    setMoveCount(newMoveCount);
    const moveNotation = getMoveNotation(piece, selectedMove.fromRow, selectedMove.fromCol, selectedMove.toRow, selectedMove.toCol, capturedPiece);
    setMoveHistory(prev => [...prev, {
      number: Math.ceil(newMoveCount / 2),
      player: 'black',
      notation: moveNotation
    }]);

    // Switch back to white
    setCurrentPlayer('white');
    setBoard(newBoard);

    // Check for game over
    checkGameOver(newBoard, 'white');
  }, [difficulty, getAllValidMoves, getBestMove, getMoveNotation, checkGameOver, endGame]);

  const handleSquareClick = useCallback((row: number, col: number) => {
    if (gameOver || currentPlayer === 'black') return;

    const piece = board[row][col];

    if (selectedSquare) {
      // Try to move to this square
      const isValid = validMoves.some(move => move.row === row && move.col === col);
      if (isValid) {
        makeMove(selectedSquare.row, selectedSquare.col, row, col);
        setSelectedSquare(null);
        setValidMoves([]);
      } else if (piece && piece.color === currentPlayer) {
        // Select different piece
        setSelectedSquare({ row, col });
        setValidMoves(getValidMoves(row, col, board));
      } else {
        // Deselect
        setSelectedSquare(null);
        setValidMoves([]);
      }
    } else if (piece && piece.color === currentPlayer) {
      // Select piece
      setSelectedSquare({ row, col });
      setValidMoves(getValidMoves(row, col, board));
    }
  }, [board, currentPlayer, gameOver, selectedSquare, validMoves, getValidMoves, makeMove]);

  const handleNewGame = useCallback(() => {
    initializeBoard();
  }, [initializeBoard]);

  const handleUndo = useCallback(() => {
    if (moveHistory.length < 2 || gameOver) return;

    // For simplicity, just restart the game
    // In production, you'd implement proper undo functionality
    initializeBoard();
  }, [moveHistory, gameOver, initializeBoard]);

  const showHint = useCallback(() => {
    if (currentPlayer !== 'white' || gameOver) return;

    const allMoves = getAllValidMoves('white', board);
    if (allMoves.length === 0) return;

    const bestMove = getBestMove(allMoves, board);

    // Highlight the hint
    setSelectedSquare({ row: bestMove.fromRow, col: bestMove.fromCol });
    setValidMoves([{ row: bestMove.toRow, col: bestMove.toCol }]);

    // Clear hint after 2 seconds
    setTimeout(() => {
      setSelectedSquare(null);
      setValidMoves([]);
    }, 2000);
  }, [currentPlayer, gameOver, board, getAllValidMoves, getBestMove]);

  const renderSquare = (row: number, col: number) => {
    const isLight = (row + col) % 2 === 0;
    const piece = board[row][col];

    let squareClasses = `chess-square w-full aspect-square flex items-center justify-center text-3xl sm:text-4xl md:text-5xl cursor-pointer transition-all duration-200 select-none touch-manipulation ${
      isLight ? 'bg-amber-100' : 'bg-amber-600'
    }`;

    // Highlight last move
    if (lastMove &&
        ((lastMove.from.row === row && lastMove.from.col === col) ||
         (lastMove.to.row === row && lastMove.to.col === col))) {
      squareClasses += isLight ? ' !bg-yellow-200' : ' !bg-yellow-500';
    }

    // Highlight selected square
    if (selectedSquare && selectedSquare.row === row && selectedSquare.col === col) {
      squareClasses += ' !bg-blue-400 ring-4 ring-blue-600 ring-inset';
    }

    // Highlight valid moves
    const isValidMove = validMoves.some(move => move.row === row && move.col === col);
    if (isValidMove) {
      const targetPiece = board[row][col];
      if (targetPiece) {
        // Capture move - red indicator
        squareClasses += ' !bg-red-400 ring-4 ring-red-600 ring-inset';
      } else {
        // Normal move - green indicator
        squareClasses += ' !bg-green-400 valid-move-indicator';
      }
    }

    if (piece && piece.color === currentPlayer && !gameOver) {
      squareClasses += ' hover:scale-110 active:scale-95';
    }

    return (
      <div
        key={`${row}-${col}`}
        className={squareClasses}
        onClick={() => handleSquareClick(row, col)}
      >
        {isValidMove && !piece && (
          <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-700 rounded-full opacity-60"></div>
        )}
        {piece && (
          <span className="drop-shadow-lg">
            {pieceSymbols[piece.color][piece.type]}
          </span>
        )}
      </div>
    );
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

      <style jsx global>{`
        * {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
        }

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

        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 5px rgba(34, 197, 94, 0.5);
          }
          50% {
            box-shadow: 0 0 20px rgba(34, 197, 94, 0.8), 0 0 30px rgba(34, 197, 94, 0.6);
          }
        }

        .valid-move-indicator {
          animation: glow 1.5s ease-in-out infinite;
        }

        @keyframes piece-move {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

        .piece-moving {
          animation: piece-move 0.3s ease-in-out;
        }

        #moveHistory::-webkit-scrollbar {
          width: 6px;
        }

        #moveHistory::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        #moveHistory::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 3px;
        }

        #moveHistory::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>

      <div className="max-w-[1100px] mx-auto px-3 sm:px-6 py-4 sm:py-8">
        {/* Header */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-amber-100 to-yellow-100 px-4 sm:px-6 py-2 sm:py-3 rounded-full mb-3 sm:mb-6 shadow-md">
            <span className="text-xl sm:text-2xl">♔</span>
            <span className="text-amber-800 font-semibold text-sm sm:text-base">Professional Chess</span>
          </div>

          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold bg-gradient-to-r from-amber-800 via-amber-600 to-yellow-600 bg-clip-text text-transparent mb-2 sm:mb-4 px-2">
            {getH1('Play Chess Online')}
          </h1>

          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
            {getSubHeading('Challenge yourself with the classic game of chess. Play against AI with multiple difficulty levels.')}
          </p>
        </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

        <div className="grid lg:grid-cols-[1fr_320px] gap-4 sm:gap-6">
          {/* Left Column: Board and Controls */}
          <div>
            {/* Game Controls */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4 mb-4">
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
                <button
                  onClick={handleNewGame}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 sm:px-6 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 active:from-green-800 active:to-emerald-800 transition-all shadow-md hover:shadow-lg touch-manipulation text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <span>🔄</span>
                    <span>New Game</span>
                  </span>
                </button>

                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(parseInt(e.target.value))}
                  className="flex-1 sm:flex-none min-h-[44px] px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white font-medium text-sm sm:text-base touch-manipulation"
                >
                  <option value="1">🟢 Easy</option>
                  <option value="2">🟡 Medium</option>
                  <option value="3">🔴 Hard</option>
                </select>

                <button
                  onClick={handleUndo}
                  disabled={moveHistory.length < 2}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 sm:px-6 py-2 bg-gradient-to-r from-orange-500 to-amber-500 text-white rounded-lg font-semibold hover:from-orange-600 hover:to-amber-600 active:from-orange-700 active:to-amber-700 transition-all shadow-md hover:shadow-lg touch-manipulation text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <span>↩️</span>
                    <span>Undo</span>
                  </span>
                </button>

                <button
                  onClick={showHint}
                  className="flex-1 sm:flex-none min-h-[44px] px-4 sm:px-6 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-cyan-600 active:from-blue-700 active:to-cyan-700 transition-all shadow-md hover:shadow-lg touch-manipulation text-sm sm:text-base"
                >
                  <span className="flex items-center gap-2 justify-center">
                    <span>💡</span>
                    <span className="hidden sm:inline">Hint</span>
                  </span>
                </button>
              </div>
            </div>

            {/* Game Status */}
            <div className="bg-gradient-to-r from-amber-50 to-yellow-50 rounded-xl shadow-md p-3 sm:p-4 mb-4 border-2 border-amber-200">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs sm:text-sm text-amber-700 font-medium mb-1">Current Turn</div>
                  <div className="text-base sm:text-lg font-bold text-amber-900">
                    {gameOver ? 'Game Over' : `${currentPlayer === 'white' ? 'White' : 'Black'} to move`}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs sm:text-sm text-amber-700 font-medium mb-1">Move #</div>
                  <div className="text-base sm:text-lg font-bold text-amber-900">{Math.ceil(moveCount / 2) || 1}</div>
                </div>
              </div>
            </div>

            {/* Chess Board */}
            <div className="bg-gradient-to-br from-amber-900 to-amber-800 rounded-2xl shadow-2xl p-3 sm:p-4 md:p-6">
              {/* Coordinate labels (top) */}
              <div className="flex justify-around mb-2 px-1">
                {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map(file => (
                  <div key={file} className="w-[12.5%] text-center text-amber-200 text-xs sm:text-sm font-semibold">{file}</div>
                ))}
              </div>

              <div className="flex">
                {/* Coordinate labels (left) */}
                <div className="flex flex-col justify-around pr-2">
                  {['8', '7', '6', '5', '4', '3', '2', '1'].map(rank => (
                    <div key={rank} className="h-[12.5%] flex items-center text-amber-200 text-xs sm:text-sm font-semibold">{rank}</div>
                  ))}
                </div>

                {/* Chess Board Grid */}
                <div className="flex-1 grid grid-cols-8 border-4 border-amber-950 rounded-lg overflow-hidden shadow-xl aspect-square">
                  {board.map((row, rowIndex) => (
                    row.map((_, colIndex) => renderSquare(rowIndex, colIndex))
                  ))}
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

            {/* Captured Pieces */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>🎯</span>
                <span>Captured Pieces</span>
              </h3>

              <div className="space-y-3">
                <div className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-2 sm:p-3">
                  <div className="text-xs font-semibold text-gray-600 mb-1">White Captured:</div>
                  <div className="text-xl sm:text-2xl min-h-[32px] flex flex-wrap gap-1">
                    {capturedWhite.length === 0 ? (
                      <span className="text-gray-400 text-sm">None</span>
                    ) : (
                      capturedWhite.map((p, i) => (
                        <span key={i}>{pieceSymbols.white[p.type]}</span>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-lg p-2 sm:p-3">
                  <div className="text-xs font-semibold text-gray-300 mb-1">Black Captured:</div>
                  <div className="text-xl sm:text-2xl min-h-[32px] flex flex-wrap gap-1">
                    {capturedBlack.length === 0 ? (
                      <span className="text-gray-500 text-sm">None</span>
                    ) : (
                      capturedBlack.map((p, i) => (
                        <span key={i}>{pieceSymbols.black[p.type]}</span>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Move History */}
            <div className="bg-white rounded-xl shadow-lg p-3 sm:p-4">
              <h3 className="text-sm sm:text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
                <span>📝</span>
                <span>Move History</span>
              </h3>
              <div id="moveHistory" className="bg-gray-50 rounded-lg p-3 h-48 sm:h-64 overflow-y-auto text-xs sm:text-sm font-mono border border-gray-200">
                {moveHistory.length === 0 ? (
                  <div className="text-gray-500 italic">Game started. White to move.</div>
                ) : (
                  <>
                    {Array.from({ length: Math.ceil(moveHistory.length / 2) }, (_, i) => {
                      const whiteMove = moveHistory[i * 2];
                      const blackMove = moveHistory[i * 2 + 1];
                      return (
                        <div key={i} className="mb-1">
                          <span className="text-gray-600 font-bold">{i + 1}.</span>
                          <span className="text-gray-800"> {whiteMove.notation}</span>
                          {blackMove && <span className="text-gray-800 ml-4">{blackMove.notation}</span>}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </div>

            {/* MREC2 - After 2 widgets (Desktop only) */}
            <SidebarMrec2 />

            {/* Game Stats */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl shadow-lg p-3 sm:p-4 border-2 border-blue-200">
              <h3 className="text-sm sm:text-base font-bold text-blue-800 mb-3 flex items-center gap-2">
                <span>📊</span>
                <span>Game Stats</span>
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 font-medium">Total Moves</div>
                  <div className="text-lg sm:text-xl font-bold text-blue-600">{moveCount}</div>
                </div>
                <div className="bg-white rounded-lg p-2 text-center">
                  <div className="text-xs text-gray-600 font-medium">Captures</div>
                  <div className="text-lg sm:text-xl font-bold text-red-600">{capturedWhite.length + capturedBlack.length}</div>
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
            <div className="bg-gradient-to-br from-white to-amber-50 rounded-2xl sm:rounded-3xl p-6 sm:p-10 max-w-md w-full text-center animate-bounce-in shadow-2xl border-4 border-amber-300">
              <div className="text-6xl sm:text-7xl mb-4 animate-pulse">
                {gameResult === 'white_wins' ? '🏆' : gameResult === 'black_wins' ? '😔' : '🤝'}
              </div>
              <h2 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-amber-600 to-yellow-600 bg-clip-text text-transparent mb-3 sm:mb-4">
                {gameResult === 'white_wins' ? 'Victory!' : gameResult === 'black_wins' ? 'Computer Wins!' : 'Stalemate!'}
              </h2>
              <p className="text-base sm:text-lg text-gray-700 mb-6">
                {gameResult === 'white_wins'
                  ? 'Congratulations! You defeated the computer!'
                  : gameResult === 'black_wins'
                    ? 'Better luck next time! Try again to improve your strategy.'
                    : 'The game ends in a draw. Well played!'}
              </p>
              <div className="bg-amber-100 rounded-lg p-4 mb-6 text-sm sm:text-base">
                <div className="font-semibold text-amber-900">Game Statistics:</div>
                <div className="text-gray-700 mt-2 space-y-1">
                  <div>Total Moves: <span className="font-bold">{moveCount}</span></div>
                  <div>Captures: <span className="font-bold">{capturedWhite.length + capturedBlack.length}</span></div>
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
        <div className="mt-6 sm:mt-8 bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-md border border-gray-200">
          <h3 className="text-lg sm:text-xl font-bold mb-4 text-gray-800 flex items-center gap-2">
            <span>📚</span>
            <span>How to Play Chess</span>
          </h3>
          <div className="grid sm:grid-cols-2 gap-4 sm:gap-6 text-sm text-gray-700">
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-blue-600">🎮</span>
                <span>Basic Rules:</span>
              </h4>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Click/tap a piece to select it, then click a highlighted square to move</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>White always moves first</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Capture opponent pieces by moving to their square</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>Protect your King from check and checkmate</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-600 font-bold flex-shrink-0">•</span>
                  <span>The game ends when a King is checkmated or captured</span>
                </li>
              </ul>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm">
              <h4 className="font-bold mb-3 text-gray-800 flex items-center gap-2">
                <span className="text-amber-600">♟️</span>
                <span>Piece Movements:</span>
              </h4>
              <ul className="space-y-2">
                <li><strong>Pawn (♟):</strong> Forward one square, capture diagonally. Two squares from start.</li>
                <li><strong>Rook (♜):</strong> Any number of squares horizontally or vertically</li>
                <li><strong>Bishop (♝):</strong> Any number of squares diagonally</li>
                <li><strong>Knight (♞):</strong> L-shaped: 2 squares in one direction, 1 perpendicular</li>
                <li><strong>Queen (♛):</strong> Any direction, any number of squares</li>
                <li><strong>King (♚):</strong> One square in any direction</li>
              </ul>
            </div>
          </div>
        </div>

        {/* SEO Content Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Chess: The Royal Game of Strategy</h2>
          <p className="text-gray-600 mb-6 leading-relaxed">
            Chess is one of the oldest and most prestigious strategy games in human history, with origins dating back over 1,500 years to ancient India. Known as the "Game of Kings," chess has captivated brilliant minds throughout the centuries, from medieval royalty to modern grandmasters. This two-player abstract strategy game is played on a checkered 8×8 board with 16 pieces per side, each with unique movement patterns and strategic value.
          </p>

          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
              <h3 className="font-semibold text-purple-800 mb-2">♔ The King</h3>
              <p className="text-sm text-gray-600">The most important piece. Moves one square in any direction. The game ends when the king is checkmated.</p>
            </div>
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <h3 className="font-semibold text-blue-800 mb-2">♕ The Queen</h3>
              <p className="text-sm text-gray-600">The most powerful piece. Combines rook and bishop movement, controlling many squares at once.</p>
            </div>
            <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
              <h3 className="font-semibold text-indigo-800 mb-2">♜ The Rook</h3>
              <p className="text-sm text-gray-600">Moves horizontally and vertically. Powerful in open files and essential for castling.</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4 border border-green-100">
              <h3 className="font-semibold text-green-800 mb-2">♝ The Bishop</h3>
              <p className="text-sm text-gray-600">Moves diagonally across the board. Each bishop controls squares of one color only.</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <h3 className="font-semibold text-amber-800 mb-2">♞ The Knight</h3>
              <p className="text-sm text-gray-600">Moves in an L-shape and can jump over pieces. Excellent for surprise attacks and forks.</p>
            </div>
            <div className="bg-rose-50 rounded-xl p-4 border border-rose-100">
              <h3 className="font-semibold text-rose-800 mb-2">♟ The Pawn</h3>
              <p className="text-sm text-gray-600">Moves forward but captures diagonally. Can promote to any piece upon reaching the opposite end.</p>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Fundamental Chess Strategies</h3>
          <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-xl p-5 mb-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-purple-700 mb-2">Control the Center</h4>
                <p className="text-sm text-gray-600">Occupy or influence the central squares (d4, d5, e4, e5) to maximize piece mobility and control.</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-700 mb-2">Develop Your Pieces</h4>
                <p className="text-sm text-gray-600">Move knights and bishops early. Castle to protect your king and connect your rooks.</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-700 mb-2">King Safety</h4>
                <p className="text-sm text-gray-600">Castle early to tuck your king away safely. Avoid moving pawns in front of your castled king.</p>
              </div>
              <div>
                <h4 className="font-medium text-purple-700 mb-2">Piece Coordination</h4>
                <p className="text-sm text-gray-600">Make your pieces work together. Coordinate attacks and protect each other for maximum effectiveness.</p>
              </div>
            </div>
          </div>

          <h3 className="text-xl font-semibold text-gray-800 mb-3">Benefits of Playing Chess</h3>
          <p className="text-gray-600 mb-4 leading-relaxed">
            Chess is renowned for its cognitive benefits. Regular play enhances critical thinking, problem-solving, and concentration. Studies show chess improves memory, pattern recognition, and planning abilities. It teaches patience, resilience, and the importance of learning from mistakes. Whether you're a beginner or an experienced player, chess offers endless opportunities for intellectual growth and competitive enjoyment.
          </p>
        </div>

        {/* Mobile MREC2 - Before FAQs */}


        <GameAppMobileMrec2 />



        {/* FAQs Section */}
        <div className="mt-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
          <FirebaseFAQs pageId="chess" fallbackFaqs={fallbackFaqs} />
        </div>
      </div>
    </>
  );
}
