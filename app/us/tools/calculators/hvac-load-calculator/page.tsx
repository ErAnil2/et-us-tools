import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import HvacLoadCalculatorClient from './HvacLoadCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'hvac-load-calculator',
  category: 'calculators',
  fallback: {
    title: 'Percentage Calculator',
    description: 'Calculate percentages',
    keywords: '',
  }
});

export default function HvacLoadCalculatorPage() {
  return <HvacLoadCalculatorClient />;
}
