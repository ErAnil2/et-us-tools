import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/page-metadata';
import LoanComparisonCalculatorClient from './LoanComparisonCalculatorClient';

// Generate metadata from JSON file
export const metadata: Metadata = generatePageMetadata({
  pageId: 'loan-comparison-calculator',
  category: 'calculators',
  fallback: {
    title: 'Loan Comparison Calculator - Compare Multiple Loan Offers Side-by-Side',
    description: 'Compare up to 3 loans side-by-side with detailed cost analysis, monthly payments, and total interest comparison.',
    keywords: 'loan comparison calculator, compare loans, loan offers, mortgage comparison, best loan rate',
  }
});

export default function LoanComparisonCalculatorPage() {
  return <LoanComparisonCalculatorClient />;
}
