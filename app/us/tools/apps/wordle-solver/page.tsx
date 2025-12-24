import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WordleSolverClient from './WordleSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'wordle-solver',
  category: 'apps',
  fallback: {
    title: 'Wordle Solver - Free Wordle Helper & Answer Finder | The Economic Times',
    description: 'Solve Wordle puzzles with our free Wordle solver! Enter your clues and get the best word suggestions. Find today\'s Wordle answer faster.',
    keywords: 'wordle solver, wordle helper, wordle answer, wordle cheat, wordle word finder, solve wordle, wordle hints, today wordle, wordle tool',
  }
});

export default function WordleSolverPage() {
  return <WordleSolverClient />;
}
