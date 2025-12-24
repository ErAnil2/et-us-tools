import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import JigsawPuzzleClient from './JigsawPuzzleClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'jigsaw-puzzle',
  category: 'games',
  fallback: {
    title: 'Jigsaw Puzzle Online - Play Free Picture Puzzles | The Economic Times',
    description: 'Play Jigsaw Puzzle online for free! Solve beautiful picture puzzles with multiple images and difficulty levels. Drag and drop pieces to complete stunning puzzles and train your brain.',
    keywords: 'jigsaw puzzle, jigsaw puzzle online, free jigsaw puzzle, picture puzzle, puzzle game, drag and drop puzzle, brain training, online puzzle',
  }
});

export default function JigsawPuzzlePage() {
  return <JigsawPuzzleClient />;
}
