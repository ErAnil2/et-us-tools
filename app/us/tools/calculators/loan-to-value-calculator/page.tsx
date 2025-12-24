import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoanToValueCalculatorClient from './LoanToValueCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'loan-to-value-calculator',
  category: 'calculators',
  fallback: {
    title: 'Loan-to-Value (LTV) Calculator - Calculate Your LTV Ratio',
    description: 'Calculate your loan-to-value ratio to understand your home equity and mortgage lending risk. Essential for refinancing and home equity decisions.',
    keywords: 'ltv calculator, loan to value calculator, ltv ratio, mortgage ltv, home equity calculator',
  }
});

export default function LoanToValueCalculatorPage() {
  return <LoanToValueCalculatorClient />;
}
