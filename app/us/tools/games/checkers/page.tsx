import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CheckersClient from './CheckersClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'checkers',
  category: 'games',
  fallback: {
    title: 'Checkers Online - Play Free Draughts Board Game | The Economic Times',
    description: 'Play Checkers online for free! Classic draughts board game with smart AI opponent. Jump and capture pieces, become a king, and master this strategic game for all ages.',
    keywords: 'checkers, checkers online, draughts, play checkers free, checkers game, board game, strategy game, checkers vs computer, free draughts',
  }
});

export default function CheckersPage() {
  return <CheckersClient />;
}
