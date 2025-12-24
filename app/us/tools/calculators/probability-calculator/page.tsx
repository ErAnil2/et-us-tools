import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import ProbabilityCalculatorClient from './ProbabilityCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'probability-calculator',
  category: 'calculators',
  fallback: {
    title: 'Probability Calculator - Calculate Odds, Combinations & Statistical Probability',
    description: 'Calculate probability for various scenarios including coin flips, dice rolls, card draws, and custom events. Includes combinations, permutations, and statistical probability.',
    keywords: '',
  }
});

export default function ProbabilityCalculatorPage() {
  return <ProbabilityCalculatorClient />;
}
