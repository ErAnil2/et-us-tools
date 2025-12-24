import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import VO2MaxCalculatorClient from './VO2MaxCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'vo2-max-calculator',
  category: 'calculators',
  fallback: {
    title: 'VO2 Max Calculator - Cardiovascular Fitness Assessment | Free Tool',
    description: 'Free VO2 max calculator to estimate your cardiovascular fitness. Calculate using Cooper test, step test, or running time. Get age-specific fitness ratings and improvement tips.',
    keywords: 'vo2 max calculator, cardiovascular fitness, Cooper test, aerobic capacity, fitness assessment, running test, step test, endurance calculator, fitness age',
  }
});

export default function VO2MaxCalculatorPage() {
  return <VO2MaxCalculatorClient />;
}
