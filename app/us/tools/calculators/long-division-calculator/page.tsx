import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LongDivisionClient from './LongDivisionClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'long-division-calculator',
  category: 'calculators',
  fallback: {
    title: 'Long Division Calculator - Step by Step Division with Remainders | The Economic Times',
    description: 'Free long division calculator showing step-by-step work. Calculate division problems with remainders, decimals, and detailed solutions for learning.',
    keywords: '',
  }
});

export default function LongDivisionPage() {
  return <LongDivisionClient />;
}
