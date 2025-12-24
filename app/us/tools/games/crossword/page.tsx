import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CrosswordClient from './CrosswordClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'crossword',
  category: 'games',
  fallback: {
    title: 'Crossword Puzzle Online - Free Daily Crossword Game | The Economic Times',
    description: 'Play crossword puzzles online for free! Solve word puzzles with clues across and down. Multiple difficulty levels for beginners to experts. Boost vocabulary and brain power.',
    keywords: 'crossword puzzle, crossword online, free crossword, daily crossword, word puzzle, brain training, vocabulary builder, crossword game',
  }
});

export default function CrosswordPage() {
  return <CrosswordClient />;
}
