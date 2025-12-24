import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CountdownClient from './CountdownClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'countdown-calculator',
  category: 'calculators',
  fallback: {
    title: 'Countdown Calculator - Count Down to Any Event | The Economic Times',
    description: 'Create countdowns to important events. Track days, hours, minutes, and seconds until your special occasions, deadlines, or milestones.',
    keywords: 'countdown calculator, event countdown, days countdown, time calculator, event timer',
  }
});

export default function CountdownPage() {
  return <CountdownClient />;
}
