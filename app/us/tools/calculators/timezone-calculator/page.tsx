import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import TimezoneCalculatorClient from './TimezoneCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'timezone-calculator',
  category: 'calculators',
  fallback: {
    title: 'Timezone Calculator - Convert Time Between Time Zones | The Economic Times',
    description: 'Convert time between different time zones worldwide. Find meeting times, schedule calls, and coordinate across global time zones.',
    keywords: 'timezone calculator, time zone converter, world clock, meeting time calculator, time difference',
  }
});

export default function TimezoneCalculatorPage() {
  return <TimezoneCalculatorClient />;
}
