import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoveCompatibilityCalculatorClient from './LoveCompatibilityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'love-compatibility-calculator',
  category: 'calculators',
  fallback: {
    title: 'Love Compatibility Calculator - Relationship Match Analyzer | The Economic Times',
    description: 'Calculate love compatibility and relationship potential with fun personality analysis. Discover your match percentage and relationship insights.',
    keywords: 'love compatibility calculator, relationship calculator, compatibility test, love match, relationship analyzer, zodiac compatibility',
  }
});

export default function LoveCompatibilityCalculatorPage() {
  return <LoveCompatibilityCalculatorClient />;
}
