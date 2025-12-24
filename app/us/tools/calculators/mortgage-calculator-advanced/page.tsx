import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MortgageCalculatorClient from './MortgageCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mortgage-calculator-advanced',
  category: 'calculators',
  fallback: {
    title: 'Mortgage Calculator - Calculate Monthly Mortgage Payments | The Economic Times',
    description: 'Calculate your monthly mortgage payments including principal, interest, taxes, and insurance. Compare different loan terms.',
    keywords: 'mortgage calculator, home loan calculator, mortgage payment calculator, house payment calculator',
  }
});

export default function MortgageCalculatorPage() {
  return <MortgageCalculatorClient />;
}
