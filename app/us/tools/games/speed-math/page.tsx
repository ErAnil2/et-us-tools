import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SpeedMathClient from './SpeedMathClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'speed-math',
  category: 'games',
  fallback: {
    title: 'Speed Math Game Online - Fast Arithmetic Challenge Free | The Economic Times',
    description: 'Play Speed Math game online for free! Test your mental math speed by solving arithmetic problems in 60 seconds. Race against the clock and beat your high score!',
    keywords: 'speed math, speed math game, fast math, mental arithmetic, math challenge, brain training, quick calculations, math race game, timed math',
  }
});

export default function SpeedMathPage() {
  return <SpeedMathClient />;
}
