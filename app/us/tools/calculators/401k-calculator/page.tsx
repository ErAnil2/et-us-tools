import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import Calculator401kClient from './Calculator401kClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: '401k-calculator',
  category: 'calculators',
  fallback: {
    title: '401k Calculator - Plan Your Retirement Savings | The Economic Times',
    description: 'Calculate 401k growth, employer matching, and retirement projections. Optimize your contribution strategy with tax benefits analysis.',
    keywords: '401k calculator, retirement calculator, 401k matching, retirement savings, 401k contributions',
  }
});

export default function Calculator401kPage() {
  return <Calculator401kClient />;
}
