import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HeartRateZoneCalculatorClient from './HeartRateZoneCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'heart-rate-zone-calculator',
  category: 'calculators',
  fallback: {
    title: 'Heart Rate Zone Calculator - Find Your Training Zones | Free Tool',
    description: 'Free heart rate zone calculator to find your 5 training zones. Calculate max heart rate, fat burning zone, and optimal cardio zones using Karvonen, Standard, or Tanaka formulas.',
    keywords: 'heart rate zone calculator, training zones, target heart rate, max heart rate calculator, fat burning zone, cardio zone, Karvonen formula, heart rate reserve, fitness calculator',
  }
});

export default function HeartRateZoneCalculatorPage() {
  return <HeartRateZoneCalculatorClient />;
}
