import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PunnettSquareCalculatorClient from './PunnettSquareCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'punnett-square-calculator',
  category: 'calculators',
  fallback: {
    title: 'Punnett Square Calculator - Genetic Inheritance & Probability Calculator',
    description: 'Calculate genetic inheritance probabilities using Punnett squares. Explore Mendelian genetics, genotype ratios, and phenotype predictions.',
    keywords: 'punnett square calculator, genetic inheritance, mendelian genetics, genotype, phenotype, alleles, genetics probability',
  }
});

export default function PunnettSquareCalculatorPage() {
  return <PunnettSquareCalculatorClient />;
}
