import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import StaircaseCalculatorClient from './StaircaseCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'staircase-calculator',
  category: 'calculators',
  fallback: {
    title: 'Staircase Calculator - Calculate Steps, Risers & Treads | The Economic Times',
    description: 'Free staircase calculator to determine optimal step dimensions, number of steps, riser height, and tread depth for safe stair construction.',
    keywords: 'staircase calculator, stair calculator, step calculator, riser height calculator, tread depth calculator, stair dimensions',
  }
});

export default function StaircaseCalculatorPage() {
  return <StaircaseCalculatorClient />;
}
