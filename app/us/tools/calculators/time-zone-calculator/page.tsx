import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimeZoneCalculatorClient from './TimeZoneCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'time-zone-calculator',
  category: 'calculators',
  fallback: {
    title: 'Time Zone Calculator - Convert Time Between Time Zones | Free Online Tool',
    description: 'Convert time between different time zones worldwide. Find meeting times, schedule calls across global time zones, and view world clock times instantly.',
    keywords: 'time zone calculator, time zone converter, world clock, meeting time calculator, time difference, global time, UTC converter, GMT converter',
  }
});

export default function TimeZoneCalculatorPage() {
  return <TimeZoneCalculatorClient />;
}
