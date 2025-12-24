import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DataUsageClient from './DataUsageClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'data-usage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Data Usage Calculator - Mobile Data & Internet Usage Planner',
    description: 'Calculate mobile data usage, internet bandwidth needs, and data plan requirements. Track streaming, downloads, and daily internet activities.',
    keywords: 'data usage calculator, mobile data calculator, internet usage, data plan calculator, bandwidth calculator',
  }
});

export default function DataUsagePage() {
  return <DataUsageClient />;
}
