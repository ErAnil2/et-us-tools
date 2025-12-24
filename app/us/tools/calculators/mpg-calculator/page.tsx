import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MpgCalculatorClient from './MpgCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mpg-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Calculator',
    description: 'Calculate percentages',
    keywords: '',
  }
});

export default function MpgCalculatorPage() {
  return <MpgCalculatorClient />;
}
