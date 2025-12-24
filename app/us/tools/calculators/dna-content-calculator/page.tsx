import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import DnaContentCalculatorClient from './DnaContentCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'dna-content-calculator',
  category: 'calculators',
  fallback: {
    title: 'Dna Content Calculator | The Economic Times',
    description: 'Free online dna content calculator. Calculate instantly with our easy-to-use tool.',
    keywords: '',
  }
});

export default function DnaContentCalculatorPage() {
  return <DnaContentCalculatorClient />;
}
