import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import NetWorthClient from './NetWorthClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'net-worth-calculator',
  category: 'calculators',
  fallback: {
    title: 'Net Worth Calculator - Calculate Your Total Net Worth | The Economic Times',
    description: 'Calculate your total net worth by tracking assets and liabilities. Get insights into your financial health with detailed breakdowns and benchmarks.',
    keywords: 'net worth calculator, assets, liabilities, financial health, wealth tracker, personal finance, asset tracking',
  }
});

export default function NetWorthPage() {
  return <NetWorthClient />;
}
