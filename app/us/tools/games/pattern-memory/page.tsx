import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PatternMemoryClient from './PatternMemoryClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pattern-memory',
  category: 'games',
  fallback: {
    title: 'Pattern Memory Game Online - Free Grid Memory Training | The Economic Times',
    description: 'Play Pattern Memory game online for free! Remember and recreate grid patterns with increasing difficulty. Train your spatial memory and working memory with this fun brain game.',
    keywords: 'pattern memory, pattern memory game, grid memory, spatial memory, brain training, memory game, cognitive training, working memory, pattern recognition',
  }
});

export default function PatternMemoryPage() {
  return <PatternMemoryClient />;
}
