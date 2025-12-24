import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LumpsumCalculatorClient from './LumpsumCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'lumpsum-calculator',
  category: 'calculators',
  fallback: {
    title: 'Lump Sum Investment Calculator - Calculate Investment Returns',
    description: 'Calculate future value of lump sum investments with compound interest. Plan your investment growth over time.',
    keywords: 'lump sum calculator, investment calculator, compound interest calculator, future value calculator',
  }
});

export default function LumpsumCalculatorPage() {
  return <LumpsumCalculatorClient />;
}
