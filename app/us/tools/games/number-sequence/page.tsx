import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NumberSequenceClient from './NumberSequenceClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'number-sequence',
  category: 'games',
  fallback: {
    title: 'Number Sequence Game Online - Free Pattern Recognition Puzzle | The Economic Times',
    description: 'Play Number Sequence game online for free! Find the next number in mathematical patterns. Practice arithmetic and geometric progressions with this brain training puzzle.',
    keywords: 'number sequence, number sequence game, pattern recognition, mathematical sequences, number patterns, logic puzzle, brain training, arithmetic progression',
  }
});

export default function NumberSequencePage() {
  return <NumberSequenceClient />;
}
