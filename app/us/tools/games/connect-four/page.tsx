import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ConnectFourClient from './ConnectFourClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'connect-four',
  category: 'games',
  fallback: {
    title: 'Connect Four Online - Play Free 4 in a Row Game | The Economic Times',
    description: 'Play Connect Four online for free! Drop colored discs to get four in a row horizontally, vertically, or diagonally. Challenge AI or play 2 players in this classic strategy game.',
    keywords: 'connect four, connect 4, four in a row, connect four online, play connect four, disc drop game, strategy game, two player game, free connect 4',
  }
});

export default function ConnectFourPage() {
  return <ConnectFourClient />;
}
