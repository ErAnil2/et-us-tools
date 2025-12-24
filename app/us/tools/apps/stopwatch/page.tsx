import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StopwatchClient from './StopwatchClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'stopwatch',
  category: 'apps',
  fallback: {
    title: 'Online Stopwatch - Free Stopwatch Timer with Lap Times | The Economic Times',
    description: 'Use our free online stopwatch with millisecond precision! Features lap times, split times, and easy controls. Perfect for sports, workouts, and timing events.',
    keywords: 'online stopwatch, stopwatch, stopwatch timer, lap timer, split timer, free stopwatch, precision timer, sports timer, workout timer',
  }
});

export default function StopwatchPage() {
  return <StopwatchClient />;
}
