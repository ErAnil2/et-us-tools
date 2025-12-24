import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TicTacToeClient from './TicTacToeClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'tic-tac-toe',
  category: 'games',
  fallback: {
    title: 'Tic Tac Toe Online - Play Free X O Game | The Economic Times',
    description: 'Play Tic Tac Toe online for free! Classic X and O game against AI or 2 players. Noughts and Crosses with multiple difficulty levels. Simple yet strategic gameplay.',
    keywords: 'tic tac toe, tic tac toe online, x and o game, noughts and crosses, free tic tac toe, play tic tac toe, strategy game',
  }
});

export default function TicTacToePage() {
  return <TicTacToeClient />;
}
