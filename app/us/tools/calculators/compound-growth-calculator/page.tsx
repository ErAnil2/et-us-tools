import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import CompoundGrowthClient from './CompoundGrowthClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'compound-growth-calculator',
  category: 'calculators',
  fallback: {
    title: 'Compound Growth Calculator - Calculate Growth Over Time | The Economic Times',
    description: 'Free compound growth calculator to calculate exponential growth over time. Perfect for investments, population growth, and business projections.',
    keywords: 'compound growth calculator, exponential growth, investment growth, population growth, CAGR',
  }
});

export default function CompoundGrowthPage() {
  return <CompoundGrowthClient />;
}
