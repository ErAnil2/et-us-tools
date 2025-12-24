import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MilesToMinutesClient from './MilesToMinutesClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'miles-to-minutes-calculator',
  category: 'calculators',
  fallback: {
    title: 'Miles to Minutes Calculator - Travel Time Calculator | Calculators101',
    description: 'Calculate travel time from distance in miles. Enter miles and speed to get estimated travel time in minutes and hours. Perfect for trip planning.',
    keywords: '',
  }
});

export default function MilesToMinutesPage() {
  return <MilesToMinutesClient />;
}
