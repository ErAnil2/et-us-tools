import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MentalMathClient from './MentalMathClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mental-math',
  category: 'games',
  fallback: {
    title: 'Mental Math Game Online - Free Brain Training Exercises | The Economic Times',
    description: 'Play Mental Math game online for free! Train your brain with fast mental calculation exercises. Improve arithmetic speed and accuracy with timed challenges for all skill levels.',
    keywords: 'mental math, mental math game, brain training, quick math, mental arithmetic, calculation speed, math games online, arithmetic practice, free mental math',
  }
});

export default function MentalMathPage() {
  return <MentalMathClient />;
}
