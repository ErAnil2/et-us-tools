import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import VisualMemoryClient from './VisualMemoryClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'visual-memory',
  category: 'games',
  fallback: {
    title: 'Visual Memory Test Online - Free Spatial Memory Game | The Economic Times',
    description: 'Play Visual Memory test online for free! Train your spatial memory by remembering tile positions on a grid. Fun brain training game with progressive difficulty levels.',
    keywords: 'visual memory, visual memory test, spatial memory, memory game, brain training, cognitive training, tile game, position memory, memory improvement',
  }
});

export default function VisualMemoryPage() {
  return <VisualMemoryClient />;
}
