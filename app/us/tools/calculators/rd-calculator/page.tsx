import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import RDCalculatorClient from './RDCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'rd-calculator',
  category: 'calculators',
  fallback: {
    title: 'Recurring Deposit Calculator - Calculate RD Maturity Amount & Returns | The Economic Times',
    description: 'Calculate recurring deposit maturity amount and returns with our comprehensive RD calculator. Plan your monthly savings with accurate projections.',
    keywords: 'rd calculator, recurring deposit calculator, rd maturity calculator, monthly deposit calculator, recurring investment',
  }
});

export default function RDCalculatorPage() {
  return <RDCalculatorClient />;
}
