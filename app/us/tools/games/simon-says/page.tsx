import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SimonSaysClient from './SimonSaysClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'simon-says',
  category: 'games',
  fallback: {
    title: 'Simon Says Game Online - Free Memory Sequence Game | The Economic Times',
    description: 'Play Simon Says game online for free! Classic memory game where you repeat color and sound sequences. Train your brain with this fun pattern recognition challenge.',
    keywords: 'simon says, simon says game, simon game online, memory game, sequence game, pattern recognition, brain training, concentration game, color sequence',
  }
});

export default function SimonSaysPage() {
  return <SimonSaysClient />;
}
