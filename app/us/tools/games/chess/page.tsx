import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ChessClient from './ChessClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'chess',
  category: 'games',
  fallback: {
    title: 'Chess Online - Play Free Chess Game vs Computer | The Economic Times',
    description: 'Play Chess online for free against AI! Classic strategy board game with multiple difficulty levels, move hints, and legal move highlights. Perfect your tactics and master the royal game.',
    keywords: 'chess, chess online, play chess free, chess game, chess vs computer, online chess, strategy game, board game, chess tactics, free chess',
  }
});

export default function ChessPage() {
  return <ChessClient />;
}
