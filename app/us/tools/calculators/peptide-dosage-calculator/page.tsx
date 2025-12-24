import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import PeptideDosageCalculatorClient from './PeptideDosageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'peptide-dosage-calculator',
  category: 'calculators',
  fallback: {
    title: 'Peptide Dosage Calculator - Calculate Peptide Doses and Reconstitution | The Economic Times',
    description: 'Free peptide dosage calculator for research purposes. Calculate peptide doses, reconstitution volumes, and concentration ratios for laboratory research.',
    keywords: 'peptide dosage calculator, peptide reconstitution calculator, research peptide calculator, peptide concentration calculator',
  }
});

export default function PeptideDosageCalculatorPage() {
  return <PeptideDosageCalculatorClient />;
}
