import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MazeRunnerClient from './MazeRunnerClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'maze-runner',
  category: 'games',
  fallback: {
    title: 'Maze Runner Game Online - Play Free Maze Puzzle | The Economic Times',
    description: 'Play Maze Runner game online for free! Navigate through challenging maze puzzles, find the exit, and collect coins. Multiple difficulty levels with exciting obstacles.',
    keywords: 'maze game, maze runner, maze puzzle, maze game online, labyrinth game, pathfinding game, navigation puzzle, free maze game',
  }
});

export default function MazeRunnerPage() {
  return <MazeRunnerClient />;
}
