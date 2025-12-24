import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PoolVolumeCalculatorClient from './PoolVolumeCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'pool-volume-calculator',
  category: 'calculators',
  fallback: {
    title: 'Pool Volume Calculator - Calculate Swimming Pool Water Capacity',
    description: 'Calculate your swimming pool volume in gallons and liters. Determine chemical dosages, heating costs, and maintenance requirements for any pool shape.',
    keywords: '',
  }
});

export default function PoolVolumeCalculatorPage() {
  return <PoolVolumeCalculatorClient />;
}
