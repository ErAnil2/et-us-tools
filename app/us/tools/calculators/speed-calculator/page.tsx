import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import SpeedCalculatorClient from './SpeedCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'speed-calculator',
  category: 'calculators',
  fallback: {
    title: 'Speed Calculator - Calculate Speed, Distance, Time | The Economic Times',
    description: 'Free speed calculator to find speed, distance, or time using the formula Speed = Distance / Time. Perfect for physics and travel calculations.',
    keywords: 'speed calculator, distance time speed, velocity calculator, physics calculator, travel time calculator',
  }
});

export default function SpeedCalculatorPage() {
  return <SpeedCalculatorClient />;
}
