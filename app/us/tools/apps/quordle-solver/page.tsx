import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import QuordleSolverClient from './QuordleSolverClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'quordle-solver',
  category: 'apps',
  fallback: {
    title: 'Quordle Solver - Free Quordle Helper & Answer Finder | The Economic Times',
    description: 'Solve Quordle puzzles with our free solver! Get strategic word suggestions for all four 5-letter word grids. Find today\'s Quordle answer faster.',
    keywords: 'quordle solver, quordle helper, quordle answer, quordle cheat, quordle hints, solve quordle, today quordle, 4 word puzzle solver, quordle words',
  }
});

export default function QuordleSolverPage() {
  return <QuordleSolverClient />;
}
