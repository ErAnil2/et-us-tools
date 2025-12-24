import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PongClient from './PongClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pong',
  category: 'games',
  fallback: {
    title: 'Pong Game Online - Play Classic Arcade Tennis Free | The Economic Times',
    description: 'Play Pong game online for free! Classic arcade table tennis with paddle controls. Challenge the AI opponent in this legendary retro game with multiple difficulty levels.',
    keywords: 'pong game, pong online, classic pong, arcade tennis, retro arcade, paddle game, table tennis game, free pong, atari pong',
  }
});

export default function PongPage() {
  return <PongClient />;
}
