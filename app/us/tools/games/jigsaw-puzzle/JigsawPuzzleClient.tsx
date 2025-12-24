'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePageSEO } from '@/lib/usePageSEO';
import Link from 'next/link';
import AdBanner from '@/components/AdBanner';
import { MobileBelowSubheadingBanner, SidebarMrec1, SidebarMrec2 } from '@/components/BannerPlacements';
import { FirebaseFAQs } from '@/components/PageSEOContent';

interface PuzzlePiece {
  id: number;
  currentPos: number;
  correctPos: number;
}

interface PuzzleImage {
  id: string;
  name: string;
  gradient: string;
  pattern?: string;
}

const puzzleImages: PuzzleImage[] = [
  { id: 'sunset', name: 'Sunset', gradient: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 25%, #ff9ff3 50%, #54a0ff 75%, #5f27cd 100%)' },
  { id: 'ocean', name: 'Ocean', gradient: 'linear-gradient(180deg, #74b9ff 0%, #0984e3 30%, #00cec9 60%, #81ecec 100%)' },
  { id: 'forest', name: 'Forest', gradient: 'linear-gradient(135deg, #00b894 0%, #55a3ff 30%, #00cec9 60%, #2d3436 100%)' },
  { id: 'aurora', name: 'Aurora', gradient: 'linear-gradient(135deg, #a29bfe 0%, #6c5ce7 25%, #00cec9 50%, #55efc4 75%, #81ecec 100%)' },
  { id: 'fire', name: 'Fire', gradient: 'linear-gradient(180deg, #fdcb6e 0%, #e17055 30%, #d63031 60%, #2d3436 100%)' },
  { id: 'galaxy', name: 'Galaxy', gradient: 'linear-gradient(135deg, #2d3436 0%, #6c5ce7 25%, #e84393 50%, #fd79a8 75%, #ffeaa7 100%)' },
];

const fallbackFaqs = [
  {
    id: '1',
    question: "What is a Jigsaw Puzzle Calculator?",
    answer: "A Jigsaw Puzzle Calculator is a free online tool designed to help you quickly and accurately calculate jigsaw puzzle-related values. It simplifies complex calculations and provides instant results.",
    order: 1
  },
  {
    id: '2',
    question: "How do I use this Jigsaw Puzzle Calculator?",
    answer: "Simply enter the required values in the input fields provided. The calculator will automatically process your inputs and display the results. You can adjust values to see different outcomes.",
    order: 2
  },
  {
    id: '3',
    question: "Is this Jigsaw Puzzle Calculator accurate?",
    answer: "Yes, our calculator uses standard formulas and algorithms to provide accurate results. It's designed for reliability and precision in everyday calculations.",
    order: 3
  },
  {
    id: '4',
    question: "Is this calculator free to use?",
    answer: "Yes, this Jigsaw Puzzle Calculator is completely free with no hidden charges or registration required. You can use it unlimited times for your calculations.",
    order: 4
  },
  {
    id: '5',
    question: "Can I use this on mobile devices?",
    answer: "Yes, this calculator is fully responsive and works on all devices including smartphones, tablets, and desktop computers. Access it anytime from any device with a web browser.",
    order: 5
  }
];

export default function JigsawPuzzleClient() {
  const { getH1, getSubHeading, faqSchema } = usePageSEO('jigsaw-puzzle');

  const [gridSize, setGridSize] = useState(3);
  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [selectedImage, setSelectedImage] = useState<PuzzleImage>(puzzleImages[0]);
  const [moves, setMoves] = useState(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [timeSpent, setTimeSpent] = useState('00:00');
  const [isComplete, setIsComplete] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [stats, setStats] = useState({
    gamesCompleted: 0,
    bestTime3x3: 0,
    bestTime4x4: 0,
    bestTime5x5: 0,
    totalMoves: 0
  });

  // Load stats from localStorage
  useEffect(() => {
    const savedStats = localStorage.getItem('jigsawStats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    }
  }, []);

  // Timer
  useEffect(() => {
    if (startTime && !isComplete) {
      const timer = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setTimeSpent(formatTime(elapsed));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [startTime, isComplete]);

  const formatTime = (ms: number): string => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const initializePuzzle = useCallback(() => {
    const totalPieces = gridSize * gridSize;
    const newPieces: PuzzlePiece[] = [];

    // Create pieces in correct order first
    for (let i = 0; i < totalPieces; i++) {
      newPieces.push({
        id: i,
        currentPos: i,
        correctPos: i
      });
    }

    // Shuffle positions (Fisher-Yates)
    const positions = [...Array(totalPieces).keys()];
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }

    // Assign shuffled positions
    newPieces.forEach((piece, index) => {
      piece.currentPos = positions[index];
    });

    setPieces(newPieces);
    setMoves(0);
    setStartTime(Date.now());
    setIsComplete(false);
    setTimeSpent('00:00');
  }, [gridSize]);

  // Initialize on mount and when grid size changes
  useEffect(() => {
    initializePuzzle();
  }, [initializePuzzle]);

  const checkCompletion = (currentPieces: PuzzlePiece[]) => {
    const complete = currentPieces.every(piece => piece.currentPos === piece.correctPos);
    if (complete && !isComplete) {
      setIsComplete(true);
      const elapsed = startTime ? Date.now() - startTime : 0;

      // Update stats
      const newStats = { ...stats };
      newStats.gamesCompleted++;
      newStats.totalMoves += moves;

      const bestTimeKey = `bestTime${gridSize}x${gridSize}` as keyof typeof stats;
      if (newStats[bestTimeKey] === 0 || elapsed < newStats[bestTimeKey]) {
        (newStats as any)[bestTimeKey] = elapsed;
      }

      setStats(newStats);
      localStorage.setItem('jigsawStats', JSON.stringify(newStats));
    }
  };

  const handleDragStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleDrop = (targetPos: number) => {
    if (draggedPiece === null) return;

    const draggedPieceData = pieces.find(p => p.id === draggedPiece);
    const targetPieceData = pieces.find(p => p.currentPos === targetPos);

    if (!draggedPieceData || !targetPieceData) return;
    if (draggedPieceData.currentPos === targetPos) return;

    const newPieces = pieces.map(piece => {
      if (piece.id === draggedPiece) {
        return { ...piece, currentPos: targetPos };
      }
      if (piece.id === targetPieceData.id) {
        return { ...piece, currentPos: draggedPieceData.currentPos };
      }
      return piece;
    });

    setPieces(newPieces);
    setMoves(m => m + 1);
    setDraggedPiece(null);
    checkCompletion(newPieces);
  };

  const handleTouchStart = (pieceId: number) => {
    setDraggedPiece(pieceId);
  };

  const handleTouchEnd = (targetPos: number) => {
    handleDrop(targetPos);
  };

  const getPieceStyle = (piece: PuzzlePiece) => {
    const row = Math.floor(piece.correctPos / gridSize);
    const col = piece.correctPos % gridSize;
    const pieceSize = 100 / gridSize;

    return {
      background: selectedImage.gradient,
      backgroundSize: `${gridSize * 100}% ${gridSize * 100}%`,
      backgroundPosition: `${col * (100 / (gridSize - 1))}% ${row * (100 / (gridSize - 1))}%` };
  };

  const getPieceSize = () => {
    if (gridSize === 3) return 'w-24 h-24 sm:w-28 sm:h-28';
    if (gridSize === 4) return 'w-20 h-20 sm:w-24 sm:h-24';
    return 'w-16 h-16 sm:w-20 sm:h-20';
  };

  const sortedPieces = [...pieces].sort((a, b) => a.currentPos - b.currentPos);

  return (
    <div className="max-w-[1200px] mx-auto px-2 sm:px-4 py-4 sm:py-6">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 rounded-full mb-3 shadow-md">
          <span className="text-xl">🧩</span>
          <span className="text-white font-semibold text-sm">Puzzle Game</span>
        </div>

        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">{getH1('Jigsaw Puzzle')}</h1>

        <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
          Drag and drop pieces to complete the picture. Match all pieces to their correct positions!
        </p>
      </div>

      {/* Mobile Below Subheading Banner */}
      <MobileBelowSubheadingBanner />

      {/* Main Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Game Area */}
        <div className="flex-1 min-w-0">
          {/* Game Container */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl shadow-lg p-4 sm:p-6 border border-blue-100">
            {/* Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 bg-white/70 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <select
                  value={gridSize}
                  onChange={(e) => setGridSize(parseInt(e.target.value))}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                >
                  <option value={3}>Easy (3x3)</option>
                  <option value={4}>Medium (4x4)</option>
                  <option value={5}>Hard (5x5)</option>
                </select>
                <select
                  value={selectedImage.id}
                  onChange={(e) => {
                    const img = puzzleImages.find(i => i.id === e.target.value);
                    if (img) setSelectedImage(img);
                  }}
                  className="px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500"
                >
                  {puzzleImages.map(img => (
                    <option key={img.id} value={img.id}>{img.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowPreview(!showPreview)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all ${
                    showPreview ? 'bg-purple-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {showPreview ? 'Hide' : 'Preview'}
                </button>
                <button
                  onClick={initializePuzzle}
                  className="flex items-center gap-1.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:from-blue-600 hover:to-purple-600 transition-all shadow-md"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Shuffle
                </button>
              </div>
            </div>

            {/* Stats Bar - Mobile */}
            <div className="grid grid-cols-3 gap-2 mb-4 lg:hidden">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">TIME</div>
                <div className="text-lg font-bold">{timeSpent}</div>
              </div>
              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">MOVES</div>
                <div className="text-lg font-bold">{moves}</div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-2 text-center text-white shadow-md">
                <div className="text-[10px] font-medium opacity-90">SIZE</div>
                <div className="text-lg font-bold">{gridSize}x{gridSize}</div>
              </div>
            </div>

            {/* Preview Image */}
            {showPreview && (
              <div className="mb-4 flex justify-center">
                <div
                  className="w-32 h-32 rounded-xl shadow-lg border-4 border-white"
                  style={{ background: selectedImage.gradient }}
                />
              </div>
            )}

            {/* Puzzle Grid */}
            <div className="flex justify-center mb-4">
              <div
                className="grid gap-1 sm:gap-1.5 p-3 sm:p-4 bg-gray-800 rounded-xl shadow-inner relative"
                style={{ gridTemplateColumns: `repeat(${gridSize}, 1fr)` }}
              >
                {sortedPieces.map((piece) => {
                  const isCorrect = piece.currentPos === piece.correctPos;
                  return (
                    <div
                      key={piece.id}
                      draggable
                      onDragStart={() => handleDragStart(piece.id)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={() => handleDrop(piece.currentPos)}
                      onTouchStart={() => handleTouchStart(piece.id)}
                      onTouchEnd={() => handleTouchEnd(piece.currentPos)}
                      onClick={() => {
                        if (draggedPiece === null) {
                          setDraggedPiece(piece.id);
                        } else {
                          handleDrop(piece.currentPos);
                        }
                      }}
                      className={`${getPieceSize()} rounded-lg cursor-move transition-all select-none ${
                        draggedPiece === piece.id ? 'ring-4 ring-yellow-400 scale-105 z-10' : ''
                      } ${isCorrect && isComplete ? 'ring-2 ring-green-400' : ''}`}
                      style={getPieceStyle(piece)}
                    >
                      {!isComplete && (
                        <div className="w-full h-full flex items-center justify-center text-white/40 font-bold text-lg">
                          {piece.id + 1}
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Win Overlay */}
                {isComplete && (
                  <div className="absolute inset-0 bg-green-500/90 rounded-xl flex flex-col items-center justify-center backdrop-blur-sm z-20">
                    <div className="text-5xl mb-3">🎉</div>
                    <div className="text-2xl font-bold text-white mb-1">Puzzle Complete!</div>
                    <div className="text-white/90 text-sm mb-1">Time: {timeSpent}</div>
                    <div className="text-white/90 text-sm mb-4">Moves: {moves}</div>
                    <button
                      onClick={initializePuzzle}
                      className="px-6 py-2 bg-white text-green-600 rounded-lg font-semibold text-sm hover:bg-green-50 transition-colors"
                    >
                      Play Again
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white/60 rounded-xl p-3 text-center text-sm text-gray-600">
              <span className="font-medium">Tip:</span> Click a piece to select it, then click another piece to swap positions
            </div>
          </div>

          {/* How to Play */}
          <div className="mt-6 bg-white rounded-2xl shadow-md p-5 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">📖</span> How to Play
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">1</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Select a Piece</div>
                  <div className="text-gray-600">Click or drag any puzzle piece</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">2</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Swap Positions</div>
                  <div className="text-gray-600">Drop it on another piece to swap</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">3</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Use Preview</div>
                  <div className="text-gray-600">Click Preview to see the target image</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-bold">4</span>
                </div>
                <div>
                  <div className="font-semibold text-gray-800">Complete the Puzzle</div>
                  <div className="text-gray-600">Match all pieces to win!</div>
                </div>
              </div>
            </div>
          </div>

          {/* Tips */}
          <div className="mt-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">💡</span> Pro Tips
            </h3>
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-blue-700 mb-1">Start with Corners</div>
                <div className="text-gray-600">Find and place corner pieces first for reference.</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-blue-700 mb-1">Use the Numbers</div>
                <div className="text-gray-600">Piece numbers help you track which piece goes where.</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-blue-700 mb-1">Work Row by Row</div>
                <div className="text-gray-600">Complete one row before moving to the next.</div>
              </div>
              <div className="bg-white rounded-xl p-4 shadow-sm">
                <div className="font-semibold text-blue-700 mb-1">Check the Preview</div>
                <div className="text-gray-600">Use preview to understand the color patterns.</div>
              </div>
            </div>
          </div>

          {/* SEO Content Section */}
          <div className="mt-6 bg-white rounded-2xl shadow-lg p-6 md:p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Understanding Jigsaw Puzzles: A Timeless Brain Exercise</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Jigsaw puzzles have captivated minds for over 250 years since John Spilsbury created the first one in 1767
              by mounting a map onto wood and cutting it into pieces. Originally called &quot;dissected maps&quot; and used as
              educational tools, jigsaw puzzles evolved into a popular form of entertainment. Today, digital jigsaw puzzles
              offer the same cognitive benefits while being accessible anywhere, anytime.
            </p>

            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-2">🧠 Cognitive Benefits</h3>
                <p className="text-sm text-gray-600">Puzzles exercise both brain hemispheres simultaneously - the logical left side and the creative right side.</p>
              </div>
              <div className="bg-purple-50 rounded-xl p-4 border border-purple-100">
                <h3 className="font-semibold text-purple-800 mb-2">🎯 Visual-Spatial Skills</h3>
                <p className="text-sm text-gray-600">Working with puzzle pieces improves your ability to visualize and manipulate objects mentally.</p>
              </div>
              <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                <h3 className="font-semibold text-green-800 mb-2">😌 Stress Relief</h3>
                <p className="text-sm text-gray-600">The focused, meditative nature of puzzling triggers relaxation and reduces anxiety levels.</p>
              </div>
              <div className="bg-orange-50 rounded-xl p-4 border border-orange-100">
                <h3 className="font-semibold text-orange-800 mb-2">📈 Problem Solving</h3>
                <p className="text-sm text-gray-600">Each piece placement requires analytical thinking and helps develop strategic problem-solving skills.</p>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl p-5 mb-6">
              <h3 className="font-bold text-gray-800 mb-3">The Science Behind Puzzles</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Research shows that jigsaw puzzles activate multiple cognitive functions including perception, rotation,
                working memory, and episodic memory. A 2018 study found that regular puzzle solving is associated with
                better performance on tasks measuring reasoning, memory, and mental speed. The satisfaction of completing
                a puzzle also releases dopamine, the &quot;feel-good&quot; neurotransmitter.
              </p>
            </div>

            <div className="bg-gray-50 rounded-xl p-5">
              <h3 className="font-bold text-gray-800 mb-3">Tips for Success</h3>
              <ul className="space-y-2 text-gray-600 text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-blue-500">•</span>
                  <span>Start with corner pieces - they have two flat edges and are easiest to identify</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-purple-500">•</span>
                  <span>Work on edge pieces next to build the frame of your puzzle</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">•</span>
                  <span>Sort pieces by color or pattern to group similar sections together</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-orange-500">•</span>
                  <span>Use the preview image frequently to understand the overall picture</span>
                </li>
              </ul>
            </div>
          </div>
</div>

        {/* Right Sidebar - 320px */}
        <div className="w-full lg:w-[320px] flex-shrink-0 space-y-4">
            {/* MREC1 - Top of sidebar (Desktop only) */}
            <SidebarMrec1 />
{/* Stats Card - Desktop */}
          <div className="hidden lg:block bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Game Stats</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl">
                <span className="text-gray-600 font-medium">Time</span>
                <span className="text-2xl font-bold text-blue-600">{timeSpent}</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-xl">
                <span className="text-gray-600 font-medium">Moves</span>
                <span className="text-2xl font-bold text-purple-600">{moves}</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Grid Size</div>
                  <div className="text-xl font-bold text-gray-700">{gridSize}x{gridSize}</div>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-xl">
                  <div className="text-xs text-gray-500">Pieces</div>
                  <div className="text-xl font-bold text-gray-700">{gridSize * gridSize}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Current Image Preview */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Target Image</h3>
            <div
              className="w-full aspect-square rounded-xl shadow-inner"
              style={{ background: selectedImage.gradient }}
            />
            <div className="text-center mt-2 text-sm font-medium text-gray-600">{selectedImage.name}</div>
          </div>

          {/* Ad Banner */}
          {/* Ad banner replaced with MREC components */}

          {/* Your Record */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Your Record</h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Puzzles Solved</span>
                <span className="font-bold text-blue-600">{stats.gamesCompleted}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Best 3x3</span>
                <span className="font-bold text-green-600">{stats.bestTime3x3 ? formatTime(stats.bestTime3x3) : '--:--'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Best 4x4</span>
                <span className="font-bold text-purple-600">{stats.bestTime4x4 ? formatTime(stats.bestTime4x4) : '--:--'}</span>
              </div>
              <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                <span className="text-gray-600 text-sm">Best 5x5</span>
                <span className="font-bold text-orange-600">{stats.bestTime5x5 ? formatTime(stats.bestTime5x5) : '--:--'}</span>
              </div>
            </div>
          </div>

          {/* Image Selection */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">Choose Image</h3>
            <div className="grid grid-cols-3 gap-2">
              {puzzleImages.map(img => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(img)}
                  className={`aspect-square rounded-lg transition-all ${
                    selectedImage.id === img.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:scale-105'
                  }`}
                  style={{ background: img.gradient }}
                  title={img.name}
                />
              ))}
            </div>
          </div>

          {/* More Games */}
          <div className="bg-white rounded-2xl shadow-md p-4 border border-gray-100">
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3">More Puzzle Games</h3>
            <div className="space-y-2">
              <Link href="/us/tools/games/2048-game" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🔢</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">2048</div>
                  <div className="text-xs text-gray-500">Number puzzle</div>
                </div>
              </Link>
              <Link href="/us/tools/games/memory-cards" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-rose-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">🃏</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Memory Cards</div>
                  <div className="text-xs text-gray-500">Match pairs</div>
                </div>
              </Link>
              <Link href="/us/tools/games/crossword" className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors group">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">📝</div>
                <div>
                  <div className="font-semibold text-gray-800 text-sm">Crossword</div>
                  <div className="text-xs text-gray-500">Word puzzle</div>
                </div>
              </Link>
            </div>
            <Link href="/us/tools/games" className="block mt-3 text-center text-sm text-blue-600 hover:text-blue-700 font-medium">
              View All Games →
            </Link>
          </div>

          {/* MREC2 - After 2 widgets (Desktop only) */}
          <SidebarMrec2 />
        </div>
      </div>

      {/* FAQs Section */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg p-3 sm:p-4 md:p-6 mb-4 sm:mb-6">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6">Frequently Asked Questions</h2>
        <FirebaseFAQs pageId="jigsaw-puzzle" fallbackFaqs={fallbackFaqs} />
      </div>
    </div>
  );
}
