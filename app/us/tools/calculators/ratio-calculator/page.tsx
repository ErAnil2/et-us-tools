import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RatioCalculatorClient from './RatioCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'ratio-calculator',
  category: 'calculators',
  fallback: {
    title: 'Ratio Calculator - Calculate, Simplify & Compare Ratios | Free Tool',
    description: 'Free ratio calculator to solve proportions, simplify ratios, compare ratios, scale by factor, and divide amounts. Step-by-step solutions with cross multiplication.',
    keywords: 'ratio calculator, proportion calculator, ratio finder, simplify ratio, cross multiplication, ratio comparison, divide by ratio',
  }
});

export default function RatioCalculatorPage() {
  return <RatioCalculatorClient />;
}
