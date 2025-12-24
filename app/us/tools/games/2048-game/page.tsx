import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import Game2048Client from './Game2048Client';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: '2048-game',
  category: 'games',
  fallback: {
    title: '2048 Game Online - Play Free Number Puzzle | The Economic Times',
    description: 'Play 2048 game online for free! Slide and merge number tiles to reach 2048. Addictive puzzle game with simple controls. Train your brain with this classic math puzzle.',
    keywords: '2048 game, 2048 online, number puzzle, sliding puzzle, tile game, puzzle game, brain game, math puzzle, free 2048',
  }
});

export default function Game2048Page() {
  return <Game2048Client />;
}
