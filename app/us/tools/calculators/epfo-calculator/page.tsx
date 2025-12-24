import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import EpfoCalculatorClient from './EpfoCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'epfo-calculator',
  category: 'calculators',
  fallback: {
    title: 'Epfo Calculator | The Economic Times',
    description: 'Free online epfo calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function EpfoCalculatorPage() {
  return <EpfoCalculatorClient />;
}
