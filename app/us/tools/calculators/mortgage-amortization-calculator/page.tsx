import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import MortgageAmortizationClient from './MortgageAmortizationClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'mortgage-amortization-calculator',
  category: 'calculators',
  fallback: {
    title: 'Mortgage Amortization Calculator - Payment Schedule | The Economic Times',
    description: 'Calculate mortgage amortization schedule with detailed monthly payment breakdown. View principal, interest, and remaining balance for each payment.',
    keywords: 'mortgage amortization, payment schedule, mortgage calculator, loan amortization, monthly payment breakdown',
  }
});

export default function MortgageAmortizationPage() {
  return <MortgageAmortizationClient />;
}
