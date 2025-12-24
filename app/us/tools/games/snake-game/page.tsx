import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SnakeGameClient from './SnakeGameClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'snake-game',
  category: 'games',
  fallback: {
    title: 'Snake Game Online - Play Classic Snake Free | The Economic Times',
    description: 'Play Snake game online for free! Classic arcade snake game where you eat food and grow longer. Nostalgic retro gaming experience with modern graphics.',
    keywords: 'snake game, snake game online, classic snake, arcade game, retro game, play snake free, nokia snake, snake io',
  }
});

export default function SnakeGamePage() {
  return <SnakeGameClient />;
}
