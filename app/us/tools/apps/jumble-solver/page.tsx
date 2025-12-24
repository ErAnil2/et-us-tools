import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import JumbleSolverClient from './JumbleSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'jumble-solver',
  category: 'apps',
  fallback: {
    title: 'Jumble Solver - Unscramble Words Free Online | The Economic Times',
    description: 'Unscramble jumbled words with our free Jumble solver! Solve daily jumble puzzles instantly. Enter scrambled letters and get all possible word combinations.',
    keywords: 'jumble solver, jumble word solver, unscramble words, daily jumble, word unscrambler, jumble answers, scrambled word solver, jumble puzzle solver',
  }
});

export default function JumbleSolverPage() {
  return <JumbleSolverClient />;
}
