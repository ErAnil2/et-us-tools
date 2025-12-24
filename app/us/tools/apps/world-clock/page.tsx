import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import WorldClockClient from './WorldClockClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'world-clock',
  category: 'apps',
  fallback: {
    title: 'World Clock Online - Current Time in Cities Worldwide | The Economic Times',
    description: 'Check world time online for free! See current time in major cities and time zones. Real-time world clock with time zone converter and city comparison.',
    keywords: 'world clock, world time, time zones, current time, international time, timezone converter, time in cities, world clock online, global time',
  }
});

export default function WorldClockPage() {
  return <WorldClockClient />;
}
