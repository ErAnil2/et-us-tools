import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MemoryCardsClient from './MemoryCardsClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'memory-cards',
  category: 'games',
  fallback: {
    title: 'Memory Card Game Online - Free Matching Pairs Puzzle | The Economic Times',
    description: 'Play Memory Card game online for free! Flip cards to find matching pairs and train your brain. Classic concentration game with multiple difficulty levels for all ages.',
    keywords: 'memory game, memory card game, matching pairs, concentration game, card matching, brain training, memory skills, card flip game, free memory game',
  }
});

export default function MemoryCardsPage() {
  return <MemoryCardsClient />;
}
