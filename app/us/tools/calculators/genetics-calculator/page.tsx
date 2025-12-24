import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import GeneticsCalculatorClient from './GeneticsCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'genetics-calculator',
  category: 'calculators',
  fallback: {
    title: 'Genetics Calculator - Punnett Square, DNA Analysis & Hardy-Weinberg',
    description: 'Free online genetics calculator for Punnett squares, DNA content analysis, Hardy-Weinberg equilibrium, and human trait prediction. Explore inheritance patterns and genetic probabilities.',
    keywords: '',
  }
});

export default function GeneticsCalculatorPage() {
  return <GeneticsCalculatorClient />;
}
