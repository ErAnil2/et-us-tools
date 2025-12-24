import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GearRatioCalculatorClient from './GearRatioCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'gear-ratio-calculator',
  category: 'calculators',
  fallback: {
    title: 'Gear Ratio Calculator | The Economic Times',
    description: 'Free online gear ratio calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function GearRatioCalculatorPage() {
  return <GearRatioCalculatorClient />;
}
