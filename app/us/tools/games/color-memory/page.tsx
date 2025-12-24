import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ColorMemoryClient from './ColorMemoryClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'color-memory',
  category: 'games',
  fallback: {
    title: 'Color Memory Game Online - Free Visual Memory Training | The Economic Times',
    description: 'Play Color Memory game online for free! Remember and repeat color sequences to train your visual memory. Progressive difficulty brain training game for all ages.',
    keywords: 'color memory, color memory game, visual memory, memory training, sequence game, brain training, pattern game, memory improvement, color sequence',
  }
});

export default function ColorMemoryPage() {
  return <ColorMemoryClient />;
}
