import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LogicGridClient from './LogicGridClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'logic-grid',
  category: 'games',
  fallback: {
    title: 'Logic Grid Puzzle Online - Free Deductive Reasoning Game | The Economic Times',
    description: 'Play Logic Grid puzzles online for free! Challenge your logical thinking with interactive grid puzzles. Use deductive reasoning to solve complex problems step by step.',
    keywords: 'logic grid, logic grid puzzle, deductive reasoning, logic puzzles, critical thinking, brain games, problem solving, grid puzzle, logic game online',
  }
});

export default function LogicGridPage() {
  return <LogicGridClient />;
}
